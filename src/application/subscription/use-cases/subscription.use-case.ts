import { Injectable } from '@nestjs/common';
import { Response } from 'express';
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

  public async handleWebhook(event: any, res: Response): Promise<any> {
    const subscription = await this.subscriptionService.handleWebhook(
      event,
      res,
    );

    return subscription;
  }

  public async cancelSubscription(subscriptionId: string): Promise<any> {
    const subscription =
      await this.subscriptionService.cancelSubscription(subscriptionId);

    return subscription;
  }
}
