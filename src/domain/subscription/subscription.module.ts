import { Global, Logger, Module } from '@nestjs/common';
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
import { HttpModule, HttpService } from '@nestjs/axios';

@Global()
@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 10000,
        maxRedirects: 3,
      }),
    }),
  ],
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
  //exports: [HttpService],
})
export class SubscriptionModule {}
