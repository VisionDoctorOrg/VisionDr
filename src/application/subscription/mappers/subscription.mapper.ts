import { CreateSubscriptionDto } from '../dtos';
import { Subscription } from 'src/domain/subscription/entities';

export class SubscriptionMapper {
  static toDomain(createSubscriptionDto: CreateSubscriptionDto): Subscription {
    return {
      amount: createSubscriptionDto.amount,
      plan: createSubscriptionDto.plan,
    };
  }

  static toDto(subscription: Subscription): Subscription {
    return {
      id: subscription.id,
      amount: subscription.amount,
      plan: subscription.plan,
      createdAt: subscription.createdAt,
      updatedAt: subscription.updatedAt,
    };
  }
}
