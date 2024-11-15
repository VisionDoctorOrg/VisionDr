import { Logger, Module } from '@nestjs/common';
import { PrismaService } from 'src/common';
import {} from 'src/application/contactUs';
import { NotificationRepository } from './interfaces';
import { NotificationService } from './services';

import {
  NotificationController,
  NotificationMapper,
  NotificationUseCase,
} from 'src/application/notification';
import { notificationRepository } from 'src/infrastructure/repositories/notification.repository';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notifications',
    }),
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    PrismaService,
    NotificationUseCase,
    NotificationMapper,
    Logger,
    {
      provide: NotificationRepository,
      useClass: notificationRepository,
    },
  ],
  exports: [BullModule],
})
export class NotificationModule {}
