import { Injectable } from '@nestjs/common';
import { NotificationPreferenceDto } from '../dtos';
import { NotificationService } from 'src/domain/notification/services';
import {
  MedicationReminder,
  NotificationPreference,
} from 'src/domain/notification/entities';
import { MedicationReminderDto } from '../dtos/medication-reminder.dto';
import { NotificationMapper } from '../mappers';
import { MedicationReminderTime } from '@prisma/client';

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

    return NotificationMapper.notificationPreference(notification);
  }

  public async createMedicationReminder(
    userId: string,
    medicationReminderDto: MedicationReminderDto,
  ): Promise<MedicationReminder> {
    const reminder = await this.notificationService.createMedicationReminder(
      userId,
      medicationReminderDto,
    );

    return NotificationMapper.medicationReminder(reminder);
  }

  public async deleteMedicationReminder(
    userId: string,
    reminderId: string,
  ): Promise<void> {
    return await this.notificationService.deleteMedicationReminder(
      userId,
      reminderId,
    );
  }

  public async getAllMedicationReminders(
    userId: string,
  ): Promise<MedicationReminder[]> {
    return await this.notificationService.getAllMedicationReminders(userId);
  }

  public async getRemindersForToday(
    userId: string,
    date: string,
  ): Promise<MedicationReminder[]> {
    return await this.notificationService.getRemindersForToday(userId, date);
  }

  public async updateReminderTimeStatus(
    userId: string,
    reminderId: string,
    completed: boolean,
  ): Promise<MedicationReminderTime> {
    return await this.notificationService.updateReminderTimeStatus(
      userId,
      reminderId,
      completed,
    );
  }
}
