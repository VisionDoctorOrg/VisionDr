import { HttpException, HttpStatus, Inject, Logger } from '@nestjs/common';
import { NotificationRepository } from '../interfaces';

import {} from 'src/application/subscription';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/domain/users/services/users.service';

import { NotificationPreferenceDto } from 'src/application/notification';
import { MedicationReminderDto } from 'src/application/notification/dtos/medication-reminder.dto';
import { MedicationReminder } from '../entities';

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

  public async createMedicationReminder(
    userId: string,
    medicationReminderDto: MedicationReminderDto,
  ): Promise<MedicationReminder> {
    // Check if a reminder for the same medication already exists for the user
    const existingReminder =
      await this.notificationRepository.findReminderByMedicationName(
        medicationReminderDto.medicationName,
        userId,
      );

    if (existingReminder) {
      throw new HttpException(
        'A reminder for this medication already exists.',
        HttpStatus.CONFLICT,
      );
    }

    return this.notificationRepository.createReminder(
      userId,
      medicationReminderDto,
    );
  }

  public async deleteMedicationReminder(
    userId: string,
    reminderId: string,
  ): Promise<void> {
    const reminder = await this.notificationRepository.findReminderById(
      reminderId,
      userId,
    );
    if (!reminder) {
      throw new Error('Reminder not found');
    }
    return this.notificationRepository.deleteReminder(reminderId);
  }

  // public async getAllMedicationReminders(
  //   userId: string,
  // ): Promise<MedicationReminder[]> {
  //   return this.notificationRepository.getAllReminders(userId);
  // }

  public async getRemindersForToday(
    userId: string,
    date: string,
  ): Promise<MedicationReminder[]> {
    return this.notificationRepository.getRemindersForToday(userId, date);
  }
}
