// cron.service.ts

import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  constructor(
    @InjectQueue('reminderQueue') private readonly reminderQueue: Queue,
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

  @Cron(CronExpression.EVERY_5_SECONDS)
  async triggerMedicationReminderCheck() {
    console.log(await this.getQueueStatus());
    this.logger.verbose(`Checking for medication reminder...`);

    const queue = await this.reminderQueue.add('scheduleMedicationReminders', {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: true,
      removeOnFail: true,
    });

    this.logger.log(
      `Successfully added forgotPassword email to queue with id ${queue.id}`,
    );
  }

  @Cron('0 0 * * *') // Once a day at midnight
  async triggerPaymentReminderCheck() {
    await this.reminderQueue.add('schedulePaymentReminders', {});
  }
}
