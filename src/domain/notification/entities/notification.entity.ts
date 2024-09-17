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
