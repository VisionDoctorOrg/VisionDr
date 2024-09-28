import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common';
import { NotificationRepository } from 'src/domain/notification/interfaces';
import { NotificationPreferenceDto } from 'src/application/notification';
import {
  MedicationReminder,
  NotificationPreference,
} from 'src/domain/notification/entities';
import { MedicationReminderDto } from 'src/application/notification/dtos/medication-reminder.dto';
import { MedicationReminderTime } from '@prisma/client';

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

  // public async createReminder(
  //   userId: string,
  //   medicationReminderDto: MedicationReminderDto,
  // ): Promise<MedicationReminder> {
  //   try {
  //     const reminder = await this.repository.medicationReminder.create({
  //       data: {
  //         userId,
  //         medicationName: medicationReminderDto.medicationName,
  //         medicationType: medicationReminderDto.medicationType,
  //         dosage: medicationReminderDto.dosage,
  //         duration: medicationReminderDto.duration,
  //         reminderTimes: {
  //           create: medicationReminderDto.reminderTimes.map((time) => ({
  //             reminderTime: new Date(time.reminderTime),
  //             completed: time.completed || false,
  //           })),
  //         },
  //       },
  //       include: {
  //         reminderTimes: true,
  //       },
  //     });

  //     return reminder;
  //   } catch (error) {
  //     console.error('Error creating medication reminder:', error);
  //     throw error;
  //   }
  // }

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

  // async getRemindersForToday(userId: string, date: string): Promise<any> {
  //   // Step 1: Fetch medication reminders for the user for the specified day
  //   const medicationReminders =
  //     await this.repository.medicationReminder.findMany({
  //       where: {
  //         userId: userId,
  //         reminderTimes: {
  //           some: {
  //             reminderTime: {
  //               gte: new Date(date), // Beginning of the day
  //               lt: new Date(new Date(date).setHours(23, 59, 59, 999)), // End of the day
  //             },
  //           },
  //         },
  //       },
  //       include: {
  //         reminderTimes: true,
  //       },
  //     });

  //   // Step 2: Initialize counters for tracking overall progress
  //   let totalRemindersForTheDay = 0;
  //   let completedRemindersForTheDay = 0;

  //   // Step 3: Calculate progress for each medication
  //   const medicationsWithProgress = medicationReminders.map((reminder) => {
  //     // Filter reminder times for the specific day
  //     const todaysReminders = reminder.reminderTimes.filter(
  //       (rt) =>
  //         rt.reminderTime.toDateString() === new Date(date).toDateString(),
  //     );

  //     const totalForThisMedication = todaysReminders.length;
  //     const completedForThisMedication = todaysReminders.filter(
  //       (rt) => rt.completed,
  //     ).length;

  //     // Update total counters for the day
  //     totalRemindersForTheDay += totalForThisMedication;
  //     completedRemindersForTheDay += completedForThisMedication;

  //     return {
  //       ...reminder,
  //     };
  //   });

  //   // Step 4:

  //   // Step 5: Return the result, including total and individual progress
  //   return {
  //     medications: medicationsWithProgress,
  //     totalRemindersForTheDay,
  //     completedRemindersForTheDay,
  //   };
  // }

  // async getRemindersForToday(userId: string, date: string): Promise<any> {
  //   // Fetch medication reminders for the user for the specified day
  //   const medicationReminders =
  //     await this.repository.medicationReminder.findMany({
  //       where: {
  //         userId: userId,
  //         reminderTimes: {
  //           some: {
  //             reminderTime: {
  //               gte: new Date(date), // Beginning of the day
  //               lt: new Date(new Date(date).setHours(23, 59, 59, 999)), // End of the day
  //             },
  //           },
  //         },
  //       },
  //       include: {
  //         reminderTimes: true,
  //       },
  //     });

  //   // Track progress for each medication
  //   const medicationsWithProgress = medicationReminders.map((reminder) => {
  //     // Get reminder times for the specific day
  //     const todaysReminders = reminder.reminderTimes.filter(
  //       (rt) =>
  //         rt.reminderTime.toDateString() === new Date(date).toDateString(),
  //     );

  //     // Calculate progress for each medication
  //     const totalForThisMedication = todaysReminders.length;
  //     const completedForThisMedication = todaysReminders.filter(
  //       (rt) => rt.completed,
  //     ).length;

  //     const progress =
  //       totalForThisMedication > 0
  //         ? (completedForThisMedication / totalForThisMedication) * 100
  //         : 0;

  //     return {
  //       ...reminder,
  //       progress: progress.toFixed(2),
  //       completedForThisMedication,
  //       totalForThisMedication,
  //     };
  //   });

  //   return {
  //     medications: medicationsWithProgress,
  //   };
  // }

  async updateReminderTimeProgress(
    reminderTimeId: string,
    progress: number,
  ): Promise<MedicationReminderTime> {
    try {
      try {
        return await this.repository.medicationReminderTime.update({
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
  ): Promise<MedicationReminderTime> {
    try {
      return await this.repository.medicationReminderTime.update({
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

  async findReminderTimeById(
    reminderTimeId: string,
  ): Promise<MedicationReminderTime> {
    try {
      return this.repository.medicationReminderTime.findUnique({
        where: {
          id: reminderTimeId,
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
              reminderTime: {
                gte: new Date(date), // Beginning of the day
                lt: new Date(new Date(date).setHours(23, 59, 59, 999)),
              },
            },
          },
        },
        include: {
          reminderTimes: {
            where: {
              reminderTime: {
                gte: new Date(date), // Beginning of the day
                lt: new Date(new Date(date).setHours(23, 59, 59, 999)),
              },
            },
            orderBy: {
              reminderTime: 'asc',
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
        progress:
          totalForThisMedication > 0
            ? (completedForThisMedication / totalForThisMedication) * 100
            : 0,
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
  ): Promise<any> {
    const { medicationName, medicationType, dosage, times, duration } =
      medicationReminderDto;

    // const medication = await this.repository.medicationReminder.create({
    //   data: {
    //     userId,
    //     medicationName,
    //     medicationType,
    //     dosage,
    //     duration,
    //   }
    // });

    for (let day = 0; day < duration; day++) {
      for (const time of times) {
        // Shifting day by +1 to start from 1
        const reminderTime = this.parseTime(time, day + 1);
        console.log('Generated Reminder Time:', reminderTime, 'Day:', day + 1);

        // await this.repository.medicationReminderTime.create({
        //   data: {
        //     medicationId: medication.id,
        //     time: reminderTime,
        //     day
        //   }
        // });
      }
    }

    // return medication;
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
}
