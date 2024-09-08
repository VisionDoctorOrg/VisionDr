import { Injectable } from '@nestjs/common';
import { MailService } from 'src/common/mail/mail.service';
import { Subscription } from 'src/domain/subscription/entities';
import { CreateSubscriptionDto } from '../dtos';
import { SubscriptionService } from 'src/domain/subscription/services';
import { SubscriptionMapper } from '../mappers';

@Injectable()
export class SubscriptionUseCase {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly mailService: MailService,
  ) {}

  async execute(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    const subscription = await this.subscriptionService.initializeSubscription(
      createSubscriptionDto,
    );

    return SubscriptionMapper.toDto(subscription);
  }
}
