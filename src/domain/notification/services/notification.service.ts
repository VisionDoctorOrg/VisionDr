import { Inject, Logger } from '@nestjs/common';
import { NotificationRepository } from '../interfaces';

import {} from 'src/application/subscription';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/domain/users/services/users.service';

import { NotificationPreferenceDto } from 'src/application/notification';

export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @Inject(NotificationRepository)
    private readonly notificationRepository: NotificationRepository,
    //private readonly usersService: UsersService,
  ) {}

  public async notificationPreference(
    userId: string,
    notificationPreference: NotificationPreferenceDto,
  ) {
    try {
      return await this.notificationRepository.create(
        {
          email: notificationPreference.email,
          sms: notificationPreference.sms,
          whatsapp: notificationPreference.whatsapp,
          paymentReminder: notificationPreference.paymentReminder,
          medicationReminder: notificationPreference.medicationReminder,
        },
        userId,
      );
    } catch (error) {
      this.logger.error(
        'Error updating notification preference:',
        error.message,
      );
      throw error;
    }
  }
}
