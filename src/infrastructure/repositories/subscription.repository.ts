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
          plan: plan.name,
          status,
          amount,
          email_token,
          nextPaymentDate: new Date(next_payment_date),
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
      } = event.data;
      return await this.repository.subscription.upsert({
        where: { subscriptionCode: subscription_code },
        update: {
          plan: plan.name,
          userId,
          subscriptionCode: subscription_code,
          status,
          amount,
          email_token,
          nextPaymentDate: new Date(next_payment_date),
        },
        create: {
          subscriptionCode: subscription_code,
          userId,
          plan: plan.name,
          status,
          amount,
          email_token,
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
