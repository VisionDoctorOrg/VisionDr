import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common';
import { NotificationRepository } from 'src/domain/notification/interfaces';
import { NotificationPreferenceDto } from 'src/application/notification';
import { NotificationPreference } from 'src/domain/notification/entities';

@Injectable()
export class notificationRepository implements NotificationRepository {
  constructor(private readonly repository: PrismaService) {}

  public async create(
    preference: NotificationPreferenceDto,
    userId: string,
  ): Promise<NotificationPreference> {
    try {
      const existingPreference =
        await this.repository.notificationPreference.findUnique({
          where: { userId },
        });

      if (!existingPreference) {
        return await this.repository.notificationPreference.create({
          data: {
            userId,
            email: preference.email,
            sms: preference.sms,
            whatsapp: preference.whatsapp,
            medicationReminder: preference.medicationReminder,
            paymentReminder: preference.paymentReminder,
          },
        });
      }

      return await this.repository.notificationPreference.update({
        where: { userId },
        data: {
          email: preference.email,
          sms: preference.sms,
          whatsapp: preference.whatsapp,
          medicationReminder: preference.medicationReminder,
          paymentReminder: preference.paymentReminder,
        },
      });
    } catch (error) {
      console.log(error);
      throw new Error('Error creating or updating preferences');
    }
  }
}
