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
      emailEnabled: notificationPreferenceDto.emailEnabled,
      whatsappEnabled: notificationPreferenceDto.whatsappEnabled,
      paymentReminder: notificationPreferenceDto.paymentReminder,
      medicationReminder: notificationPreferenceDto.medicationReminder,
      smsEnabled: notificationPreferenceDto.smsEnabled,
    };
  }

  static notificationPreference(
    preference: NotificationPreference,
  ): NotificationPreference {
    return {
      id: preference.id,
      emailEnabled: preference.emailEnabled,
      whatsappEnabled: preference.whatsappEnabled,
      smsEnabled: preference.smsEnabled,
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
