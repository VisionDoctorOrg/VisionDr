import { HttpException, HttpStatus, Inject, Logger } from '@nestjs/common';
import { NotificationRepository } from '../interfaces';

import {} from 'src/application/subscription';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/domain/users/services/users.service';

import { NotificationPreferenceDto } from 'src/application/notification';
import { MedicationReminderDto } from 'src/application/notification/dtos/medication-reminder.dto';
import { MedicationReminder, ReminderTime } from '../entities';
// import { ReminderTime } from '@prisma/client';

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
          emailEnabled: notificationPreference.emailEnabled,
          smsEnabled: notificationPreference.smsEnabled,
          whatsappEnabled: notificationPreference.whatsappEnabled,
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

  // public async deleteMedicationReminder(
  //   userId: string,
  //   reminderTimeId: string,
  // ): Promise<void> {
  //   try {
  //     const reminder = await this.notificationRepository.findReminderTimeById(
  //       reminderTimeId,
  //       userId,
  //     );
  //     if (!reminder) {
  //       throw new HttpException('Reminder not found', HttpStatus.NOT_FOUND);
  //     }
  //     return this.notificationRepository.deleteReminder(reminderTimeId);
  //   } catch (error) {
  //     this.logger.error(error);
  //     throw error;
  //   }
  // }

  public async deleteReminderAndUpdateProgress(
    userId: string,
    reminderTimeId: string,
  ): Promise<void> {
    // Fetch reminder along with medication and its reminderTimes
    const reminder = await this.notificationRepository.findReminderTimeById(
      reminderTimeId,
      userId,
    );

    if (!reminder) {
      throw new HttpException('Reminder not found', HttpStatus.NOT_FOUND);
    }

    // Delete the reminder time
    await this.notificationRepository.deleteReminder(reminderTimeId);

    // Recalculate progress for remaining reminders
    const remainingReminders = reminder.medicationReminder.reminderTimes.filter(
      (rt) => rt.id !== reminderTimeId,
    );

    const completedReminders = remainingReminders.filter(
      (rt) => rt.completed,
    ).length;

    const progress =
      remainingReminders.length > 0
        ? Number(
            ((completedReminders / remainingReminders.length) * 100).toFixed(2),
          )
        : 0;

    // Update remaining reminders with new progress
    const updateProgressPromises = remainingReminders.map((rt) =>
      this.notificationRepository.updateReminderTimeProgress(rt.id, progress),
    );

    await Promise.all(updateProgressPromises);
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

  // public async updateReminderTimeStatus(
  //   userId: string,
  //   reminderTimeId: string,
  //   completed: boolean,
  // ): Promise<ReminderTime> {
  //   try {
  //     const existingReminderTime =
  //       await this.notificationRepository.findReminderTimeById(
  //         reminderTimeId,
  //         userId,
  //       );
  //     if (!existingReminderTime) {
  //       throw new HttpException('Reminder not found', HttpStatus.NOT_FOUND);
  //     }
  //     const updatedReminderTime =
  //       await this.notificationRepository.updateReminderTime(
  //         reminderTimeId,
  //         completed,
  //       );

  //     // Get Parent medication
  //     const reminder =
  //       await this.notificationRepository.getMedicationByReminderTimeId(
  //         reminderTimeId,
  //       );

  //     console.log(reminder);
  //     // Recalculate the number of completed reminders
  //     // Total number of reminders for the specific reminder time
  //     const totalRemindersForReminderTime = reminder.reminderTimes.length;

  //     // Recalculate the number of completed reminders for this reminder time
  //     const completedReminders = reminder.reminderTimes.filter(
  //       (rt) => rt.completed,
  //     ).length;

  //     // Calculate the progress for this reminder time based on completed reminders

  //     const progress = Number(
  //       ((completedReminders / totalRemindersForReminderTime) * 100).toFixed(2),
  //     );

  //     const updatedReminderTimesPromises = reminder.reminderTimes.map(
  //       async (rt) => {
  //         console.log(rt);
  //         return this.notificationRepository.updateReminderTimeProgress(
  //           rt.id,
  //           progress,
  //         );
  //       },
  //     );

  //     // Wait for all updates to complete
  //     await Promise.all(updatedReminderTimesPromises);

  //     // Return the specific reminder time that was updated
  //     return updatedReminderTime;
  //   } catch (error) {
  //     this.logger.error(error);
  //     throw error;
  //   }
  // }

  public async updateReminderTimeStatus(
    userId: string,
    reminderTimeId: string,
    completed: boolean,
  ): Promise<ReminderTime> {
    try {
      // Check if the reminder time exists for the user
      const existingReminderTime =
        await this.notificationRepository.findReminderTimeById(
          reminderTimeId,
          userId,
        );
      if (!existingReminderTime) {
        throw new HttpException('Reminder not found', HttpStatus.NOT_FOUND);
      }

      // Update the completed status for the specific reminder time
      const updatedReminderTime =
        await this.notificationRepository.updateReminderTime(
          reminderTimeId,
          completed,
        );

      // Get the parent medication for this reminder time
      const reminder =
        await this.notificationRepository.getMedicationByReminderTimeId(
          reminderTimeId,
        );

      // Total number of reminder times associated with this medication
      const totalRemindersForMedication = reminder.reminderTimes.length;

      // Count how many reminders are marked as completed
      const completedReminders = reminder.reminderTimes.filter(
        (rt) => rt.completed,
      ).length;

      // Calculate progress based on the number of completed reminders
      const progress = Number(
        ((completedReminders / totalRemindersForMedication) * 100).toFixed(2),
      );

      // Update the progress for all reminder times of this medication
      const updatedReminderTimesPromises = reminder.reminderTimes.map(
        async (rt) => {
          return this.notificationRepository.updateReminderTimeProgress(
            rt.id,
            progress,
          );
        },
      );

      // Wait for all progress updates to complete
      await Promise.all(updatedReminderTimesPromises);

      // Return the updated reminder time that was specifically modified
      return updatedReminderTime;
    } catch (error) {
      this.logger.error(`Error updating reminder time: ${error.message}`);
      throw new HttpException(
        'Could not update reminder time',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUsersWithUpcomingMedications(): Promise<
    { userId: string; reminders: any[] }[]
  > {
    const upcomingReminders =
      await this.notificationRepository.getRemindersDueSoon();
    console.log(upcomingReminders);

    // Group reminders by user
    const remindersByUser = upcomingReminders.reduce(
      (result, reminder) => {
        if (!result[reminder.userId]) {
          result[reminder.userId] = [];
        }
        result[reminder.userId].push(reminder);
        return result;
      },
      {} as Record<string, any[]>,
    );

    // Map grouped reminders into an array
    return Object.entries(remindersByUser).map(([userId, reminders]) => ({
      userId,
      reminders,
    }));
  }
}
