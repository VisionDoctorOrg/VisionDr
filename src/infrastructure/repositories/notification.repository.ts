import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common';
import { NotificationRepository } from 'src/domain/notification/interfaces';
import { NotificationPreferenceDto } from 'src/application/notification';
import {
  MedicationReminder,
  NotificationPreference,
} from 'src/domain/notification/entities';
import { MedicationReminderDto } from 'src/application/notification/dtos/medication-reminder.dto';

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

  public async createReminder(
    userId: string,
    medicationReminderDto: MedicationReminderDto,
  ): Promise<MedicationReminder> {
    try {
      const reminder = await this.repository.medicationReminder.create({
        data: {
          userId,
          medicationName: medicationReminderDto.medicationName,
          medicationType: medicationReminderDto.medicationType,
          dosage: medicationReminderDto.dosage,
          duration: medicationReminderDto.duration,
          progress: 0,
          reminderTimes: {
            create: medicationReminderDto.reminderTimes.map((time) => ({
              reminderTime: new Date(time.reminderTime),
              completed: time.completed || false,
            })),
          },
        },
        include: {
          reminderTimes: true,
        },
      });

      return reminder;
    } catch (error) {
      console.error('Error creating medication reminder:', error);
      throw error;
    }
  }

  public async deleteReminder(reminderId: string): Promise<void> {
    try {
      await this.repository.medicationReminder.delete({
        where: { id: reminderId },
      });
    } catch (error) {
      throw error;
    }
  }

  public async getAllReminders(userId: string): Promise<MedicationReminder[]> {
    try {
      return this.repository.medicationReminder.findMany({
        where: { userId },
      });
    } catch (error) {
      throw error;
    }
  }

  public async findReminderById(
    reminderId: string,
    userId: string,
  ): Promise<MedicationReminder> {
    try {
      return this.repository.medicationReminder.findFirst({
        where: {
          id: reminderId,
          userId,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  public async findReminderByMedicationName(
    medicationName: string,
    userId: string,
  ): Promise<MedicationReminder> {
    try {
      return this.repository.medicationReminder.findFirst({
        where: {
          medicationName,
          userId,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getRemindersForToday(userId: string, date: string): Promise<any> {
    // Step 1: Fetch medication reminders for the user for the specified day
    const medicationReminders =
      await this.repository.medicationReminder.findMany({
        where: {
          userId: userId,
          reminderTimes: {
            some: {
              reminderTime: {
                gte: new Date(date), // Beginning of the day
                lt: new Date(new Date(date).setHours(23, 59, 59, 999)), // End of the day
              },
            },
          },
        },
        include: {
          reminderTimes: true, // Include the reminder times for each medication
        },
      });

    // Step 2: Initialize counters for tracking overall progress
    let totalRemindersForTheDay = 0;
    let completedRemindersForTheDay = 0;

    // Step 3: Calculate progress for each medication
    const medicationsWithProgress = medicationReminders.map((reminder) => {
      // Filter reminder times for the specific day
      const todaysReminders = reminder.reminderTimes.filter(
        (rt) =>
          rt.reminderTime.toDateString() === new Date(date).toDateString(),
      );

      const totalForThisMedication = todaysReminders.length;
      const completedForThisMedication = todaysReminders.filter(
        (rt) => rt.completed,
      ).length;

      // Calculate the percentage progress for this medication
      const progress =
        totalForThisMedication > 0
          ? (completedForThisMedication / totalForThisMedication) * 100
          : 0;

      // Update total counters for the day
      totalRemindersForTheDay += totalForThisMedication;
      completedRemindersForTheDay += completedForThisMedication;

      return {
        ...reminder,
        progress: progress.toFixed(2), // Example: "58.00%"
        completedForThisMedication,
        totalForThisMedication,
      };
    });

    // Step 4: Calculate overall progress for all medications
    const overallProgress =
      totalRemindersForTheDay > 0
        ? (completedRemindersForTheDay / totalRemindersForTheDay) * 100
        : 0;

    // Step 5: Return the result, including total and individual progress
    return {
      medications: medicationsWithProgress,
      totalRemindersForTheDay,
      completedRemindersForTheDay,
      overallProgress: overallProgress.toFixed(2), // Example: "60.00%"
    };
  }
}
