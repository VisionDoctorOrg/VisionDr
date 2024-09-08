import { Inject, Injectable, Logger } from '@nestjs/common';
import { SubscriptionRepository } from '../interfaces';
import { Subscription } from '../entities';
import { CreateSubscriptionDto } from 'src/application/subscription';

@Injectable()
export class SubscriptionService {
  constructor(
    @Inject(SubscriptionRepository)
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly logger: Logger,
  ) {}

  public async initializeSubscription(
    CreateSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    try {
      return await this.subscriptionRepository.create(CreateSubscriptionDto);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
