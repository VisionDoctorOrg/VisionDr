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
  reminderTimes?: MedicationReminderTime[];
  totalRemindersForTheDay?: number;
  completedRemindersForTheDay?: number;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class MedicationReminderTime {
  id?: string;
  reminderTime?: Date;
  completed?: boolean;
  medication?: MedicationReminder;
  totalRemindersForTheDay?: number;
  completedRemindersForTheDay?: number;
  progress?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
