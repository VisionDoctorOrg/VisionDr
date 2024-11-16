// cron.service.ts

import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';
import { NotificationService } from './notification.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  constructor(
    @InjectQueue('reminderQueue') private readonly reminderQueue: Queue,
    private readonly notificationService: NotificationService,
  ) {}

  async getQueueStatus() {
    const waiting = await this.reminderQueue.getWaitingCount();
    const active = await this.reminderQueue.getActiveCount();
    const delayed = await this.reminderQueue.getDelayedCount();
    const failed = await this.reminderQueue.getFailedCount();
    const completed = await this.reminderQueue.getCompletedCount();

    return {
      waiting,
      active,
      delayed,
      failed,
      completed,
    };
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async triggerMedicationReminderCheck() {
    this.logger.verbose(`Running medication reminder cron job...`);

    // Fetch users with upcoming reminders
    const usersWithReminders =
      await this.notificationService.getUsersWithUpcomingMedications();

    for (const user of usersWithReminders) {
      const queue = await this.reminderQueue.add(
        'scheduleMedicationReminders',
        { userId: user.userId, reminders: user.reminders },
        {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
          removeOnComplete: true,
          removeOnFail: true,
        },
      );
      this.logger.log(
        `Successfully added scheduleMedicationReminders to queue with id ${queue.id} for userId ${user.userId}`,
      );
    }
  }

  @Cron('0 0 * * *') // Once a day at midnight
  async triggerPaymentReminderCheck() {
    await this.reminderQueue.add('schedulePaymentReminders', {});
  }
}
