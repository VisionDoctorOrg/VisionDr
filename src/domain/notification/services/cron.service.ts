// cron.service.ts

import { Cron } from '@nestjs/schedule';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CronService {
  constructor(
    @InjectQueue('reminderQueue') private readonly reminderQueue: Queue,
  ) {}

  @Cron('*/10 * * * *') // Every 10 minutes
  async triggerMedicationReminderCheck() {
    await this.reminderQueue.add('scheduleMedicationReminders', {});
  }

  @Cron('0 0 * * *') // Once a day at midnight
  async triggerPaymentReminderCheck() {
    await this.reminderQueue.add('schedulePaymentReminders', {});
  }
}
