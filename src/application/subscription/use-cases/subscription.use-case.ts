import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto, InitializeSubscription } from '../dtos';
import { SubscriptionService } from 'src/domain/subscription/services';

@Injectable()
export class SubscriptionUseCase {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  public async InitializeSubscription(
    userId: string,
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<InitializeSubscription> {
    const subscription = await this.subscriptionService.initializeSubscription(
      userId,
      createSubscriptionDto,
    );

    return subscription;
  }
}
