// notification.processor.ts
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { NotificationRepository } from '../interfaces';
import { Inject, Logger } from '@nestjs/common';
import { SubscriptionService } from 'src/domain/subscription/services';
import { NotificationService } from './notification.service';

@Processor('reminderQueue')
export class NotificationProcessor {
  private readonly logger = new Logger(NotificationProcessor.name);
  constructor(
    @Inject(NotificationRepository)
    private readonly subscriptionService: SubscriptionService,
  ) {}

  @Process('scheduleMedicationReminders')
  async scheduleMedicationReminders(job: Job) {
    const { userId, reminders } = job.data;

    this.logger.log(
      `Processing scheduleMedicationReminders for userId ${userId}...`,
    );

    for (const reminder of reminders) {
      console.log('reminder:', reminder);
      for (const reminderTime of reminder.reminderTimes) {
        console.log('reminderTime:', reminderTime);
        const timeDiff = reminderTime.time.getTime() - Date.now();
        console.log('timeDiff:', timeDiff);
        if (timeDiff > 0) {
          // Schedule the individual reminder job 5 minutes before the actual time
          await job.queue.add(
            'medicationReminder',
            {
              userId: reminder.userId,
              medicationName: reminder.medicationName,
              reminderTime: reminderTime.time,
            },
            { delay: timeDiff - 5 * 60 * 1000 }, // Schedule 5 minutes early.
          );
        }
      }
    }
  }

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
