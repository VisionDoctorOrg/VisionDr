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
              reminderId: reminderTime.id,
              reminderTime: reminderTime.time,
              notified: true,
            },
            {
              delay: notificationTime.getTime() - now.getTime(), // Calculate delay
            },
          );
        }
      }
    }
  }

  @Process('medicationReminder')
  async medicationReminder(job: Job) {
    const { userId, reminderId, notified, reminderTime } = job.data;
    console.log(userId, reminderId, notified, reminderTime);
    this.logger.log(
      `Sending medication reminder for userId ${userId} for reminderId ${reminderId} at ${reminderTime}`,
    );
    console.log(userId, notified, reminderTime, reminderId);
    // Send notification (email, SMS, etc.)
    // await this.notificationService.sendMedicationReminder(
    //   userId,
    //   medicationName,
    //   reminderTime,
    // );

    // Update the reminder as notified in the database
    await this.notificationService.updateReminderNotification(
      userId,
      reminderId,
      notified,
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
