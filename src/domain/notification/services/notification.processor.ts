// notification.processor.ts
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { NotificationRepository } from '../interfaces';
import { Inject, Logger } from '@nestjs/common';
import { SubscriptionService } from 'src/domain/subscription/services';
import { NotificationService } from './notification.service';
import { error } from 'console';

@Processor('reminderQueue')
export class NotificationProcessor {
  private readonly logger = new Logger(NotificationProcessor.name);
  constructor(
    @Inject(NotificationRepository)
    private readonly subscriptionService: SubscriptionService,
    private readonly notificationService: NotificationService,
  ) {}

  // @Process('scheduleMedicationReminders')
  // async scheduleMedicationReminders(job: Job) {
  //   const { userId, reminders } = job.data;

  //   this.logger.log(
  //     `Processing scheduleMedicationReminders for userId ${userId}...`,
  //   );

  //   for (const reminder of reminders) {
  //     console.log('reminder:', reminder);
  //     for (const reminderTime of reminder.reminderTimes) {
  //       console.log('reminderTime:', reminderTime);
  //       const timeDiff = reminderTime.time.getTime() - Date.now();
  //       console.log('timeDiff:', timeDiff);
  //       if (timeDiff > 0) {
  //         // Schedule the individual reminder job 5 minutes before the actual time
  //         await job.queue.add(
  //           'medicationReminder',
  //           {
  //             userId: reminder.userId,
  //             medicationName: reminder.medicationName,
  //             reminderTime: reminderTime.time,
  //           },
  //           { delay: timeDiff - 5 * 60 * 1000 }, // Schedule 5 minutes early.
  //         );
  //       }
  //     }
  //   }
  // }

  @Process('scheduleMedicationReminders')
  async scheduleMedicationReminders(job: Job) {
    const { userId, reminders } = job.data;

    this.logger.log(
      `Processing scheduleMedicationReminders for userId ${userId}...`,
    );

    for (const reminder of reminders) {
      for (const reminderTime of reminder.reminderTimes) {
        console.log(reminderTime);

        // Offset in milliseconds
        const localOffset = new Date().getTimezoneOffset() * 60 * 1000;

        // Stored time in UTC
        const reminderDateTime = new Date(reminderTime.time);

        // 5 mins before
        const notificationTime = new Date(
          reminderDateTime.getTime() - 5 * 60 * 1000,
        );
        const now = new Date(Date.now() - localOffset);

        console.log('reminderDateTime (UTC):', reminderDateTime);
        console.log('notificationTime (UTC):', notificationTime);
        console.log('now (UTC):', now);

        // Ensure consistent comparison
        if (notificationTime > now) {
          await job.queue.add(
            'medicationReminder',
            {
              userId: reminder.userId,
              medicationName: reminder.medicationName,
              reminderTime: reminderDateTime,
            },
            {
              delay: notificationTime.getTime() - now.getTime(), // Calculate delay
            },
          );
        }
      }
    }
  }

  // @Process('scheduleMedicationReminders')
  // async scheduleMedicationReminders(job: Job) {
  //   const { userId, reminders } = job.data;

  //   this.logger.log(
  //     `Processing scheduleMedicationReminders for userId ${userId}...`,
  //   );

  //   for (const reminder of reminders) {
  //     for (const reminderTime of reminder.reminderTimes) {
  //       console.log(reminderTime);
  //       const reminderDateTime = new Date(reminderTime.time);
  //       const notificationTime = new Date(
  //         reminderDateTime.getTime() - 5 * 60 * 1000,
  //       );
  //       const now = new Date();
  //       console.log('reminderDateTime:', reminderDateTime);
  //       console.log('notificationTime:', notificationTime);
  //       console.log('now:', now);
  //       // Only schedule if notification time is in the future

  //       if (notificationTime > now) {
  //         await job.queue.add(
  //           'medicationReminder',
  //           {
  //             userId: reminder.userId,
  //             medicationName: reminder.medicationName,
  //             reminderTime: reminderDateTime,
  //           },
  //           {
  //             delay: notificationTime.getTime() - now.getTime(),
  //           },
  //         );
  //       }
  //     }
  //   }
  // }

  @Process('medicationReminder')
  async medicationReminder(job: Job) {
    const { userId, medicationName, reminderTime } = job.data;

    this.logger.log(
      `Sending medication reminder for userId ${userId} for ${medicationName} at ${reminderTime}`,
    );
    console.log(userId, medicationName, reminderTime);
    // Send notification (email, SMS, etc.)
    // await this.notificationService.sendMedicationReminder(
    //   userId,
    //   medicationName,
    //   reminderTime,
    // );

    // Update the reminder as notified in the database
    await this.notificationService.updateReminderNotification(
      userId,
      medicationName,
      true,
    );
  }

  @Process('schedulePaymentReminders')
  async schedulePaymentReminders(job: Job) {
    const userId = job.data.userId;
    const subscriptionsDueSoon =
      await this.subscriptionService.getSubscriptionsDueSoon(userId);

    for (const subscription of subscriptionsDueSoon) {
      const timeDiff =
        new Date(subscription.nextPaymentDate).getTime() - Date.now();

      if (timeDiff > 0) {
        await job.queue.add(
          'paymentReminder',
          {
            userId: subscription.userId,
            nextPaymentDate: subscription.nextPaymentDate,
          },
          { delay: timeDiff - 24 * 60 * 60 * 1000 }, // 1 day before due date
        );
      }
    }
  }
}
