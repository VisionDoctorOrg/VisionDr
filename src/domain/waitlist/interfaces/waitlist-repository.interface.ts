import { Waitlist } from '../entities';
import { IRepository } from 'src/common';
export const WaitlistRepository = Symbol('WaitlistRepository');

export interface WaitlistRepository extends IRepository<Waitlist> {
  findByEmail(email: string): Promise<Waitlist | null>;
}
