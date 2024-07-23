import { Waitlist } from '../entities';
import { IRepository } from 'src/common';
export const WaitlistRepository = Symbol('WaitlistRepository');

export interface WaitlistRepository extends IRepository<Waitlist> {
  findByEmailOrPhone(email: string, phone: string): Promise<Waitlist | null>;
}
