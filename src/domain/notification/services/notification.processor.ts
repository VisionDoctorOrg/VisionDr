// notification.processor.ts
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { NotificationRepository } from '../interfaces';
import { Inject } from '@nestjs/common';
import { SubscriptionService } from 'src/domain/subscription/services';
import { NotificationService } from './notification.service';

@Processor('reminderQueue')
export class NotificationProcessor {
  constructor(
    @Inject(NotificationRepository)
    private readonly subscriptionService: SubscriptionService,
    private readonly notificationService: NotificationService,
  ) {}

  @Process('scheduleMedicationReminders')
  async scheduleMedicationReminders() {
    console.log('about', new Date());
    const userId = 'job.data.userId';
    // const upcomingMedications =
    //   await this.notificationService.getUpcomingMedications(userId);

    // for (const medication of upcomingMedications) {
    //   for (const reminderTime of medication.reminderTimes) {
    //     const timeDiff = reminderTime.time.getTime() - Date.now();

    //     if (timeDiff > 0) {
    //       await job.queue.add(
    //         'medicationReminder',
    //         {
    //           userId: medication.userId,
    //           medicationName: medication.medicationName,
    //           reminderTime: reminderTime.time,
    //         },
    //         { delay: timeDiff - 5 * 60 * 1000 }, // 5 minutes before time
    //       );
    //     }
    //   }
    // }
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
