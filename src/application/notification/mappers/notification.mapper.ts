import {
  MedicationReminder,
  NotificationPreference,
} from 'src/domain/notification/entities';
import { NotificationPreferenceDto } from '../dtos';

export class NotificationMapper {
  static toDomain(
    notificationPreferenceDto: NotificationPreferenceDto,
  ): NotificationPreference {
    return {
      email: notificationPreferenceDto.email,
      whatsapp: notificationPreferenceDto.whatsapp,
      paymentReminder: notificationPreferenceDto.paymentReminder,
      medicationReminder: notificationPreferenceDto.medicationReminder,
      sms: notificationPreferenceDto.sms,
    };
  }

  static notificationPreference(
    preference: NotificationPreference,
  ): NotificationPreference {
    return {
      id: preference.id,
      email: preference.email,
      whatsapp: preference.whatsapp,
      sms: preference.sms,
      paymentReminder: preference.paymentReminder,
      medicationReminder: preference.medicationReminder,
      userId: preference.userId,
      createdAt: preference.createdAt,
      updatedAt: preference.updatedAt,
    };
  }

  static medicationReminder(reminder: MedicationReminder): MedicationReminder {
    return {
      id: reminder.id,
      medicationName: reminder.medicationName,
      medicationType: reminder.medicationType,
      dosage: reminder.dosage,
      duration: reminder.duration,
      userId: reminder.userId,
      createdAt: reminder.createdAt,
      updatedAt: reminder.updatedAt,
    };
  }
}
