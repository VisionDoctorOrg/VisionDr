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

@Module({
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
})
export class NotificationModule {}
