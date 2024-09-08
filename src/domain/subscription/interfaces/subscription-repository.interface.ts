import { Subscription } from '../entities';
import { IRepository } from 'src/common';
export const SubscriptionRepository = Symbol('SubscriptionRepository');

export interface SubscriptionRepository extends IRepository<Subscription> {}
