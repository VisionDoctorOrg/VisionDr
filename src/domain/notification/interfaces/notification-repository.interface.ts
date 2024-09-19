import { NotificationPreferenceDto } from 'src/application/notification';
import { MedicationReminder, NotificationPreference } from '../entities';
import { IRepository } from 'src/common';
import { MedicationReminderDto } from 'src/application/notification/dtos/medication-reminder.dto';
export const NotificationRepository = Symbol('NotificationRepository');

export interface NotificationRepository
  extends IRepository<NotificationPreference> {
  deleteReminder(reminderId: string): Promise<void>;
  getRemindersForToday(
    userId: string,
    date: string,
  ): Promise<MedicationReminder[]>;
  getAllReminders(userId: string): Promise<MedicationReminder[]>;
  findReminderByMedicationName(
    medicationName: string,
    userId: string,
  ): Promise<MedicationReminder>;
  findReminderById(
    reminderId: string,
    userId: string,
  ): Promise<MedicationReminder>;
  createReminder(
    userId: string,
    medicationReminderDto: MedicationReminderDto,
  ): Promise<MedicationReminder>;
}
