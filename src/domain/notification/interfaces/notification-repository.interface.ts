import { NotificationPreferenceDto } from 'src/application/notification';
import { NotificationPreference } from '../entities';
import { IRepository } from 'src/common';
export const NotificationRepository = Symbol('NotificationRepository');

export interface NotificationRepository
  extends IRepository<NotificationPreference> {
  // findActiveSubscriptionById(subscriptionId: string): Promise<any | null>;
  // notificationPreference(
  //   userId: string,
  //   notificationPreference: NotificationPreferenceDto,
  // ): Promise<NotificationPreference>;
}
