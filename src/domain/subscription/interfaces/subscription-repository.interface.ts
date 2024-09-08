import { Subscription } from '../entities';
import { IRepository } from 'src/common';
export const SubscriptionRepository = Symbol('SubscriptionRepository');

export interface SubscriptionRepository extends IRepository<Subscription> {
  findActiveSubscriptionById(subscriptionId: string): Promise<any | null>;
  markSubscriptionAsCanceled(subscriptionId: string): Promise<void>;
  updateSubscriptionStatus(
    status: string,
    subscription_code: string,
    nextPaymentDate: Date,
  ): Promise<Subscription>;
  upsertSubscription(userId: string, event: any): Promise<Subscription>;
}
