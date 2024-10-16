import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common';
import { CreateSubscriptionDto } from 'src/application/subscription';
import { SubscriptionRepository } from 'src/domain/subscription/interfaces';
import { Subscription } from 'src/domain/subscription/entities';

@Injectable()
export class subscriptionRepository implements SubscriptionRepository {
  constructor(private readonly repository: PrismaService) {}

  public async create(event: any, userId: string): Promise<any> {
    try {
      const {
        subscription_code,
        status,
        amount,
        plan,
        next_payment_date,
        email_token,
      } = event;
      return await this.repository.subscription.create({
        data: {
          subscriptionCode: subscription_code,
          userId,
          plan: plan, // plan.name or plan ID for the free plan
          status, // 'active' for free plan
          amount, // 0 for free plan
          email_token, // null for free plan
          nextPaymentDate: next_payment_date
            ? new Date(next_payment_date)
            : null,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  public async upsertSubscription(userId: string, event: any): Promise<any> {
    try {
      const {
        subscription_code,
        status,
        amount,
        plan,
        next_payment_date,
        email_token,
        authorization,
      } = event.data;

      // 1. Find any active subscription for the user
      const activeSubscription = await this.repository.subscription.findFirst({
        where: {
          userId,
          status: 'active',
        },
      });

      // 2. If there is an active subscription, mark it as inactive.
      if (activeSubscription) {
        await this.repository.subscription.update({
          where: { id: activeSubscription.id },
          data: { status: 'inactive' },
        });
      }

      return await this.repository.subscription.upsert({
        where: { subscriptionCode: subscription_code },
        update: {
          plan: plan.name,
          userId,
          subscriptionCode: subscription_code,
          status,
          amount,
          email_token,
          authorization_code: authorization.authorization_code,
          last4: authorization.last4,
          exp_month: authorization.exp_month,
          exp_year: authorization.exp_year,
          channel: authorization.channel,
          card_type: authorization.card_type,
          bank: authorization.bank,
          country_code: authorization.country_code,
          brand: authorization.brand,
          reusable: authorization.reusable,
          signature: authorization.signature,
          account_name: authorization.account_name,
          nextPaymentDate: new Date(next_payment_date),
        },
        create: {
          subscriptionCode: subscription_code,
          userId,
          plan: plan.name,
          status,
          amount,
          email_token,
          authorization_code: authorization.authorization_code,
          last4: authorization.last4,
          exp_month: authorization.exp_month,
          exp_year: authorization.exp_year,
          channel: authorization.channel,
          card_type: authorization.card_type,
          bank: authorization.bank,
          country_code: authorization.country_code,
          brand: authorization.brand,
          reusable: authorization.reusable,
          signature: authorization.signature,
          account_name: authorization.account_name,
          nextPaymentDate: new Date(next_payment_date),
        },
      });
    } catch (error) {
      throw error;
    }
  }

  public async updateSubscriptionStatus(
    status: string,
    subscription_code: string,
    nextPaymentDate: Date,
  ): Promise<Subscription> {
    try {
      return await this.repository.subscription.update({
        where: { subscriptionCode: subscription_code },
        data: { status, nextPaymentDate },
      });
    } catch (error) {
      throw error;
    }
  }

  public async findActiveSubscriptionById(
    subscriptionId: string,
  ): Promise<Subscription> {
    try {
      return await this.repository.subscription.findUnique({
        where: { id: subscriptionId, status: 'active' },
        include: { user: true },
      });
    } catch (error) {
      throw error;
    }
  }

  public async markSubscriptionAsCanceled(
    subscriptionId: string,
  ): Promise<void> {
    try {
      await this.repository.subscription.update({
        where: { id: subscriptionId },
        data: { status: 'canceled' },
      });
    } catch (error) {
      throw error;
    }
  }
}
