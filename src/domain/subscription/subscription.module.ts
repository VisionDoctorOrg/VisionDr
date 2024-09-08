import { Logger, Module } from '@nestjs/common';
import { PrismaService } from 'src/common';
import {} from 'src/application/contactUs';
import { SubscriptionRepository } from './interfaces';
import { SubscriptionService } from './services';
import { MailService } from 'src/common/mail/mail.service';
import {
  SubscriptionController,
  SubscriptionMapper,
  SubscriptionUseCase,
} from 'src/application/subscription';
import { subscriptionRepository } from 'src/infrastructure/repositories/subscription.repository';

@Module({
  controllers: [SubscriptionController],
  providers: [
    SubscriptionService,
    MailService,
    PrismaService,
    SubscriptionUseCase,
    SubscriptionMapper,
    Logger,
    {
      provide: SubscriptionRepository,
      useClass: subscriptionRepository,
    },
  ],
})
export class SubscriptionModule {}
