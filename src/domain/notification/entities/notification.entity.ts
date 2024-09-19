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
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
