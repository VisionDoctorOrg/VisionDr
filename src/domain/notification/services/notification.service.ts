import { HttpException, HttpStatus, Inject, Logger } from '@nestjs/common';
import { NotificationRepository } from '../interfaces';

import {} from 'src/application/subscription';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/domain/users/services/users.service';

import { NotificationPreferenceDto } from 'src/application/notification';
import { MedicationReminderDto } from 'src/application/notification/dtos/medication-reminder.dto';
import { MedicationReminder } from '../entities';
import { MedicationReminderTime } from '@prisma/client';

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
    try {
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
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  public async deleteMedicationReminder(
    userId: string,
    reminderId: string,
  ): Promise<void> {
    try {
      const reminder = await this.notificationRepository.findReminderById(
        reminderId,
        userId,
      );
      if (!reminder) {
        throw new HttpException('Reminder not found', HttpStatus.NOT_FOUND);
      }
      return this.notificationRepository.deleteReminder(reminderId);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  public async getAllMedicationReminders(
    userId: string,
  ): Promise<MedicationReminder[]> {
    return this.notificationRepository.getAllReminders(userId);
  }

  public async getRemindersForToday(
    userId: string,
    date: string,
  ): Promise<MedicationReminder[]> {
    try {
      return this.notificationRepository.getRemindersForToday(userId, date);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  public async updateReminderTimeStatus(
    userId: string,
    reminderTimeId: string,
    completed: boolean,
  ): Promise<MedicationReminderTime> {
    try {
      const existingReminderTime =
        await this.notificationRepository.findReminderTimeById(
          reminderTimeId,
          userId,
        );
      if (!existingReminderTime) {
        throw new HttpException('Reminder not found', HttpStatus.NOT_FOUND);
      }
      const updatedReminderTime =
        await this.notificationRepository.updateReminderTime(
          reminderTimeId,
          completed,
        );

      // Get Parent medication
      const reminder =
        await this.notificationRepository.getMedicationByReminderTimeId(
          reminderTimeId,
        );

      console.log(reminder);
      // Recalculate the number of completed reminders
      // Total number of reminders for the specific reminder time
      const totalRemindersForReminderTime = reminder.reminderTimes.length;

      // Recalculate the number of completed reminders for this reminder time
      const completedReminders = reminder.reminderTimes.filter(
        (rt) => rt.completed,
      ).length;

      // Calculate the progress for this reminder time based on completed reminders

      const progress = Number(
        ((completedReminders / totalRemindersForReminderTime) * 100).toFixed(2),
      );

      const updatedReminderTimesPromises = reminder.reminderTimes.map(
        async (rt) => {
          console.log(rt);
          return this.notificationRepository.updateReminderTimeProgress(
            rt.id,
            progress,
          );
        },
      );

      // Wait for all updates to complete
      await Promise.all(updatedReminderTimesPromises);

      // Return the specific reminder time that was updated
      return updatedReminderTime;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
