import { Logger, Module } from '@nestjs/common';
import { PrismaService } from 'src/common';
import { NotificationRepository } from './interfaces';
import { NotificationService } from './services';

import {
  NotificationController,
  NotificationMapper,
  NotificationUseCase,
} from 'src/application/notification';
import { notificationRepository } from 'src/infrastructure/repositories/notification.repository';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationProcessor } from './services/notification.processor';
import { SubscriptionRepository } from '../subscription/interfaces';
import { subscriptionRepository } from 'src/infrastructure/repositories/subscription.repository';
import { SubscriptionService } from '../subscription/services';
import { CronService } from './services/cron.service';
import { RedisTestService } from './services/edis-test.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    BullModule.registerQueue({
      name: 'reminderQueue',
    }),
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    SubscriptionService,
    PrismaService,
    NotificationUseCase,
    NotificationMapper,
    CronService,
    // RedisTestService,
    NotificationProcessor,
    Logger,
    {
      provide: NotificationRepository,
      useClass: notificationRepository,
    },
    {
      provide: SubscriptionRepository,
      useClass: subscriptionRepository,
    },
  ],
  exports: [BullModule],
})
export class NotificationModule {}
