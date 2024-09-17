import { Injectable } from '@nestjs/common';
import { NotificationPreferenceDto } from '../dtos';
import { NotificationService } from 'src/domain/notification/services';
import { NotificationPreference } from 'src/domain/notification/entities';

@Injectable()
export class NotificationUseCase {
  constructor(private readonly notificationService: NotificationService) {}

  public async notificationPreference(
    userId: string,
    notificationPreferenceDto: NotificationPreferenceDto,
  ): Promise<NotificationPreference> {
    const notification = await this.notificationService.notificationPreference(
      userId,
      notificationPreferenceDto,
    );

    return notification;
  }
}
