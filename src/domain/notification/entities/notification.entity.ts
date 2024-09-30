//import { MedicationReminderTime } from '@prisma/client';

export class NotificationPreference {
  id?: string;
  email?: boolean;
  sms?: boolean;
  whatsapp?: boolean;
  medicationReminder?: boolean;
  paymentReminder?: boolean;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class MedicationReminder {
  id?: string;
  medicationName?: string;
  medicationType?: string;
  dosage?: string;
  duration?: number;
  reminderTimes?: ReminderTime[];
  totalRemindersForTheDay?: number;
  completedRemindersForTheDay?: number;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ReminderTime {
  id?: string;
  time?: Date;
  day?: number;
  completed?: boolean;
  medicationId?: string;
  medicationReminder?: MedicationReminder;
  totalRemindersForTheDay?: number;
  completedRemindersForTheDay?: number;
  progress?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
