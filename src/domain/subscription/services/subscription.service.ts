import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Response } from 'express';
import { SubscriptionRepository } from '../interfaces';
import { Subscription } from '../entities';
import {
  CreateSubscriptionDto,
  InitializeSubscription,
} from 'src/application/subscription';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/domain/users/services/users.service';
import { firstValueFrom } from 'rxjs';

export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);
  private readonly baseUrl: string;
  private readonly secretKey: string;

  constructor(
    @Inject(SubscriptionRepository)
    private readonly subscriptionRepository: SubscriptionRepository,
    
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly httpService: HttpService,
  ) {
    this.baseUrl = this.configService.get<string>('PAYSTACK_BASEURL');
    this.secretKey = this.configService.get<string>('PAYSTACK_SECRETKEY');
  }

  public async initializeSubscription(
    userId: string,
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<any> {
    try {
      this.logger.debug('Initializing subscription starting...');
      const user = await this.usersService.findUserById(userId);

      // Check if the plan is free
      if (createSubscriptionDto.amount === 0) {
        // Directly create a free subscription in the repository without calling Paystack
        const subscriptionData = {
          subscription_code: `free-plan-${userId}`, // Unique code for free subscription
          status: 'active', // Set status to active directly
          amount: 0, // Free plan has no cost
          plan: 'Free Plan', // Free plan name or ID
          next_payment_date: null, // No next payment for free plan
          email_token: null, // No token needed for free plan
        };

        const freeSubscription = await this.subscriptionRepository.create(
          subscriptionData,
          userId,
        );

        this.logger.debug('Free subscription created successfully');
        return freeSubscription;
      }

      const url = `${this.baseUrl}/transaction/initialize`;
      const headers = { Authorization: `Bearer ${this.secretKey}` };
      const data = {
        email: user.email,
        amount: createSubscriptionDto.amount,
        plan: createSubscriptionDto.plan,
      };

      const response = await firstValueFrom(
        this.httpService.post(url, data, { headers }),
      );

      this.logger.debug('Subscription initialized successfully');
      return response.data;
    } catch (error) {
      if (error.response) {
        this.logger.error('Error response data:', error.response.data);
        throw new Error(`Paystack error: ${error.response.data.message}`);
      }
      this.logger.error('Error initializing subscription:', error.message);
      throw new Error('Error initializing subscription');
    }
  }

  // public async initializeSubscription(
  //   userId: string,
  //   createSubscriptionDto: CreateSubscriptionDto,
  // ): Promise<any> {
  //   try {
  //     this.logger.debug('Initializing subscription starting...');
  //     const user = await this.usersService.findUserById(userId);

  //     // Check if the plan is free
  //     if (createSubscriptionDto.amount === 0) {
  //       // Directly create a free subscription in the repository without calling Paystack
  //       const subscriptionData = {
  //         subscription_code: `free-plan-${userId}`, // Unique code for free subscription
  //         status: 'active',                         // Set status to active directly
  //         amount: 0,                                // Free plan has no cost
  //         plan: createSubscriptionDto.plan,         // Free plan name or ID
  //         next_payment_date: null,                  // No next payment for free plan
  //         email_token: null,                        // No token needed for free plan
  //       };

  //       const freeSubscription = await this.subscriptionRepository.create(
  //         subscriptionData,
  //         userId,
  //       );

  //       this.logger.debug('Free subscription created successfully');
  //       return freeSubscription;
  //     }

  //     // If not a free plan, proceed to call Paystack's subscription API
  //     const url = `${this.baseUrl}/subscription`;
  //     const headers = { Authorization: `Bearer ${this.secretKey}` };
  //     const data = {
  //       customer: user.email,    // The customer's email
  //       plan: createSubscriptionDto.plan, // The plan ID from Paystack
  //     };

  //     const response = await firstValueFrom(
  //       this.httpService.post(url, data, { headers }),
  //     );

  //     this.logger.debug('Subscription created successfully');
  //     return response.data;  // Return Paystack's response data
  //   } catch (error) {
  //     if (error.response) {
  //       this.logger.error('Error response data:', error.response.data);
  //       throw new Error(`Paystack error: ${error.response.data.message}`);
  //     }
  //     this.logger.error('Error initializing subscription:', error.message);
  //     throw new Error('Error initializing subscription');
  //   }
  // }

  public async subscriptionPlans(): Promise<any> {
    try {
      this.logger.debug('About to fetch subscription...');
      //const user = await this.usersService.findUserById(userId);
      const url = `${this.baseUrl}/plan`;
      const headers = { Authorization: `Bearer ${this.secretKey}` };
      // const data = {
      //   email: user.email,
      //   amount: createSubscriptionDto.amount,
      //   plan: createSubscriptionDto.plan,
      // };

      const response = await firstValueFrom(
        this.httpService.get(url, { headers }),
      );

      this.logger.debug('Subscription plans successfully fetched');
      return response.data;
    } catch (error) {
      if (error.response) {
        this.logger.error('Error response data:', error.response.data);
        throw new Error(`Paystack error: ${error.response.data.message}`);
      }
      this.logger.error('Error fetch subscription plans:', error.message);
      throw new Error('Error fetch subscription plans');
    }
  }

  public async handleWebhook(event: any, res: Response) {
    try {
      if (event.event === 'subscription.create') {
        this.logger.debug(
          `Webhook received and about to process: ${event.event}`,
        );
        const { customer } = event.data;

        const user = await this.usersService.findByEmail(customer.email);
        if (user) {
          this.logger.debug(
            `About updating subscription details from processed webhook`,
          );

          // Use repository to update subscription status
          await this.subscriptionRepository.upsertSubscription(user.id, event);

          this.logger.debug(`Updating user subscription status to Active`);
          await this.usersService.updateUserSubscriptionStatus(
            user.id,
            'Active',
          );
        }

        this.logger.debug(`Successfully updated all fields`);
        //res.sendStatus(200);
      } else if (event.event === 'subscription.not_renew') {
        this.logger.debug(
          `Webhook received for subscription cancellation: ${event.event}`,
        );
        const { subscription_code, customer, status, next_payment_date } =
          event.data;

        const user = await this.usersService.findByEmail(customer.email);
        if (user) {
          this.logger.debug(
            `About to cancel subscription for user: ${user.id}`,
          );
          await this.subscriptionRepository.updateSubscriptionStatus(
            status,
            subscription_code,
            new Date(next_payment_date),
          );

          this.logger.debug(`Updating user subscription status to inactive`);
          await this.usersService.updateUserSubscriptionStatus(
            user.id,
            'Inactive',
          );

          this.logger.debug(`Successfully cancelled user subscription`);
        }
      }
    } catch (error) {
      this.logger.error('Error handling webhook:', error);
      throw error;
    }
  }

  public async cancelSubscription(subscriptionId: string) {
    try {
      this.logger.debug(`Cancelling subscription with Id: ${subscriptionId}`);

      const subscription =
        await this.subscriptionRepository.findActiveSubscriptionById(
          subscriptionId,
        );

      if (!subscription) {
        throw new HttpException(
          'No active subscription found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (!subscription.email_token) {
        throw new HttpException(
          'No actively paid subscription found',
          HttpStatus.NOT_FOUND,
        );
      }

      const url = `${this.baseUrl}/subscription/disable`;
      const headers = { Authorization: `Bearer ${this.secretKey}` };
      const data = {
        code: subscription.subscriptionCode,
        token: subscription.email_token,
      };

      const response = await firstValueFrom(
        this.httpService.post(url, data, { headers }),
      );

      this.logger.debug(`Subscription API response: ${response.data}`);

      return { message: 'Subscription cancelled successfully' };
    } catch (error) {
      this.logger.error('Error cancelling subscription:', error.message);
      throw error;
    }
  }

  async getSubscriptionsDueSoon(userId: string): Promise<Subscription[]> { 
    try {
      return await this.subscriptionRepository.getSubscriptionsDueSoon(userId);
    } catch (error) {
      throw error;
    }
  }
}
