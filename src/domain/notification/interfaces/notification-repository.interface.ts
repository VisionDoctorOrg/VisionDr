import { MedicationReminder, NotificationPreference } from '../entities';
import { IRepository } from 'src/common';
import { MedicationReminderDto } from 'src/application/notification/dtos/medication-reminder.dto';
import { MedicationReminderTime } from '@prisma/client';
export const NotificationRepository = Symbol('NotificationRepository');

export interface NotificationRepository
  extends IRepository<NotificationPreference> {
  deleteReminder(reminderId: string): Promise<void>;
  updateReminderTime(
    reminderId: string,
    completed: boolean,
  ): Promise<MedicationReminderTime>;
  getMedicationByReminderTimeId(
    reminderTimeId: string,
  ): Promise<MedicationReminder>;
  updateMedicationReminder(
    reminderId: string,
    progress: number,
  ): Promise<MedicationReminder>;
  getRemindersForToday(
    userId: string,
    date: string,
  ): Promise<MedicationReminder[]>;
  getAllReminders(userId: string): Promise<MedicationReminder[]>;
  findReminderByMedicationName(
    medicationName: string,
    userId: string,
  ): Promise<MedicationReminder>;
  findReminderTimeById(
    reminderTimeId: string,
    userId: string,
  ): Promise<MedicationReminderTime>;
  findReminderById(
    reminderId: string,
    userId: string,
  ): Promise<MedicationReminder>;
  createReminder(
    userId: string,
    medicationReminderDto: MedicationReminderDto,
  ): Promise<MedicationReminder>;
}
