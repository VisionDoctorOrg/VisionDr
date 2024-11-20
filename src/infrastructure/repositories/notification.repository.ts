import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common';
import { NotificationRepository } from 'src/domain/notification/interfaces';
import { NotificationPreferenceDto } from 'src/application/notification';
import {
  MedicationReminder,
  NotificationPreference,
  ReminderTime,
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
            emailEnabled: preference.emailEnabled,
            smsEnabled: preference.smsEnabled,
            whatsappEnabled: preference.whatsappEnabled,
            medicationReminder: preference.medicationReminder,
            paymentReminder: preference.paymentReminder,
          },
        });
      }

      return await this.repository.notificationPreference.update({
        where: { userId },
        data: {
          emailEnabled: preference.emailEnabled,
          smsEnabled: preference.smsEnabled,
          whatsappEnabled: preference.whatsappEnabled,
          medicationReminder: preference.medicationReminder,
          paymentReminder: preference.paymentReminder,
        },
      });
    } catch (error) {
      console.log(error);
      throw new Error('Error creating or updating preferences');
    }
  }

  public async deleteReminder(reminderTimeId: string): Promise<void> {
    try {
      await this.repository.reminderTime.delete({
        where: { id: reminderTimeId },
      });
    } catch (error) {
      throw error;
    }
  }

  public async getAllReminders(userId: string): Promise<MedicationReminder[]> {
    try {
      return this.repository.medicationReminder.findMany({
        where: { userId },
        include: { reminderTimes: true },
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

  async updateReminderTimeProgress(
    reminderTimeId: string,
    progress: number,
  ): Promise<ReminderTime> {
    try {
      try {
        return await this.repository.reminderTime.update({
          where: { id: reminderTimeId },
          data: { progress },
        });
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }

  async updateReminderTime(
    reminderTimeId: string,
    completed: boolean,
  ): Promise<ReminderTime> {
    try {
      return await this.repository.reminderTime.update({
        where: { id: reminderTimeId },
        data: { completed },
      });
    } catch (error) {
      throw error;
    }
  }

  async getMedicationByReminderTimeId(
    reminderId: string,
  ): Promise<MedicationReminder> {
    try {
      return this.repository.medicationReminder.findFirst({
        where: {
          reminderTimes: {
            some: {
              id: reminderId,
            },
          },
        },
        include: { reminderTimes: true },
      });
    } catch (error) {
      throw error;
    }
  }

  async findReminderTimeById(reminderTimeId: string): Promise<ReminderTime> {
    try {
      return this.repository.reminderTime.findUnique({
        where: {
          id: reminderTimeId,
        },
        include: {
          medicationReminder: {
            include: {
              reminderTimes: true,
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getRemindersForToday(userId: string, date: string): Promise<any> {
    const medicationReminders =
      await this.repository.medicationReminder.findMany({
        where: {
          userId: userId,
          reminderTimes: {
            some: {
              time: {
                gte: new Date(date), // Beginning of the day
                lt: new Date(new Date(date).setHours(23, 59, 59, 999)),
              },
            },
          },
        },
        include: {
          reminderTimes: {
            where: {
              time: {
                gte: new Date(date), // Beginning of the day
                lt: new Date(new Date(date).setHours(23, 59, 59, 999)),
              },
            },
            orderBy: {
              time: 'asc',
            },
          },
        },
      });

    let totalReminders = 0;
    let completedReminders = 0;

    const medicationsWithProgress = medicationReminders.map((reminder) => {
      const totalForThisMedication = reminder.reminderTimes.length;
      const completedForThisMedication = reminder.reminderTimes.filter(
        (rt) => rt.completed,
      ).length;

      totalReminders += totalForThisMedication;
      completedReminders += completedForThisMedication;

      return {
        ...reminder,
      };
    });

    return {
      medications: medicationsWithProgress,
      totalReminders,
      completedReminders,
      overallProgress:
        totalReminders > 0 ? (completedReminders / totalReminders) * 100 : 0,
    };
  }

  async createReminder(
    userId: string,
    medicationReminderDto: MedicationReminderDto,
  ): Promise<MedicationReminder> {
    const { medicationName, medicationType, dosage, times, duration } =
      medicationReminderDto;

    // Starting a transaction
    return this.repository.$transaction(async (prisma) => {
      // Creating the medicationReminder along with its associated reminderTimes
      const medication = await prisma.medicationReminder.create({
        data: {
          userId,
          medicationName,
          medicationType,
          dosage,
          duration,
          reminderTimes: {
            // Creating reminderTimes for each day and each time
            create: Array.from({ length: duration }, (_, day) =>
              times.map((time) => ({
                time: this.parseTime(time, day + 1), // Generating time for each reminder
                day: day + 1, // Day starts from 1
              })),
            ).flat(), // Flatten the array so that all reminders are in one array
          },
        },
        include: {
          reminderTimes: true, // Include reminderTimes in the result
        },
      });

      return medication; // Return the created medication with reminderTimes
    });
  }

  private parseTime(timeString: string, day: number): Date {
    // Match time like 10:00AM or 12:30PM
    const regex = /^(\d{1,2}:\d{2})(AM|PM)$/;
    const match = timeString.match(regex);

    if (!match) {
      throw new Error('Invalid time format');
    }

    const [_, time, period] = match;

    let [hour, minute] = time.split(':').map(Number);

    // Adjust the hour based on the period (AM/PM)
    if (period === 'PM' && hour !== 12) {
      hour += 12;
    } else if (period === 'AM' && hour === 12) {
      hour = 0; // midnight case
    }

    // Create a new date object starting from today
    const date = new Date();
    date.setDate(date.getDate() + day - 1);
    // Set the parsed hour and minute in the local timezone
    date.setHours(hour, minute, 0, 0);

    // Ensure that the date is correct with local timezone.
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000,
    );

    return localDate;
  }

  // async getRemindersDueSoon(): Promise<MedicationReminder[]> {
  //   const currentTimes = new Date();
  //   const upcomingTime = new Date(currentTimes.getTime() + 5 * 60 * 1000);
  //   console.log(currentTimes, upcomingTime);
  //   const currentTime = new Date();
  //   console.log('Local Time:', currentTime.toLocaleString());
  //   console.log('UTC Time:', currentTime.toISOString());

  //   return this.repository.medicationReminder.findMany({
  //     where: {
  //       reminderTimes: {
  //         some: {
  //           time: { gte: currentTime, lte: upcomingTime },
  //           completed: false,
  //         },
  //       },
  //     },
  //     include: {
  //       reminderTimes: {
  //         where: {
  //           time: { gte: currentTime, lte: upcomingTime },
  //           completed: false,
  //         },
  //         orderBy: {
  //           time: 'asc',
  //         },
  //       },
  //     },
  //   });
  // }

  async getRemindersDueSoon(): Promise<MedicationReminder[]> {
    // Adjust time based on offset if needed
    const localOffset = new Date().getTimezoneOffset() * 60 * 1000; // Offset in milliseconds
    const currentTime = new Date(Date.now() - localOffset); // Adjusted for local timezone
    const upcomingTime = new Date(currentTime.getTime() + 10 * 60 * 1000);

    // Debug logging
    console.log({
      localOffset: localOffset,
      currentTime: currentTime.toISOString(),
      upcomingTime: upcomingTime.toISOString(),
      explanation: `Finding reminders due between ${currentTime} and ${upcomingTime.toLocaleTimeString()}`,
    });

    // Query the reminders
    return this.repository.medicationReminder.findMany({
      where: {
        reminderTimes: {
          some: {
            time: { gte: currentTime, lte: upcomingTime },
            completed: false,
            notified: false,
          },
        },
      },
      include: {
        reminderTimes: {
          where: {
            time: { gte: currentTime, lte: upcomingTime },
            completed: false,
            notified: false,
          },
          orderBy: {
            time: 'asc',
          },
        },
      },
    });
  }

  async updateReminderNotification(
    reminderTimeId: string,
    notified: boolean,
  ): Promise<ReminderTime> {
    try {
      return await this.repository.reminderTime.update({
        where: { id: reminderTimeId },
        data: { notified },
      });
    } catch (error) {
      throw error;
    }
  }

  // async getRemindersDueSoon(): Promise<MedicationReminder[]> {
  //   let currentTime = new Date(); // Current time in UTC
  //   currentTime.toLocaleTimeString();
  //   const notificationTime = new Date(currentTime.getTime() + 30 * 60 * 1000); // 30 mins ahead
  //   const upcomingTime = new Date(notificationTime.getTime() + 5 * 60 * 1000); // 5 mins after notification

  //   // Clean logging
  //   console.log('currentTime (UTC):', currentTime);
  //   console.log(
  //     'notificationTime (UTC, 30 mins ahead):',
  //     notificationTime.toISOString(),
  //   );
  //   console.log(
  //     'upcomingTime (UTC, 5 mins later):',
  //     upcomingTime.toISOString(),
  //   );

  //   console.log('currentTime (Local):', currentTime.toLocaleTimeString()); // Local time representation

  //   // Query the reminders
  //   return this.repository.medicationReminder.findMany({
  //     where: {
  //       reminderTimes: {
  //         some: {
  //           time: { gte: currentTime, lte: upcomingTime }, // Between current and upcoming time
  //           completed: false,
  //         },
  //       },
  //     },
  //     include: {
  //       reminderTimes: {
  //         where: {
  //           time: { gte: currentTime, lte: upcomingTime },
  //           completed: false,
  //         },
  //         orderBy: {
  //           time: 'asc',
  //         },
  //       },
  //     },
  //   });
  // }
}
