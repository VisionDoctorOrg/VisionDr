import { IRepository } from 'src/common';
import { User } from '../entities/user.entity';
import { AuthProvider } from '@prisma/client';
export const UserRepository = Symbol('UserRepository');

export interface UserRepository extends IRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  findByProviderId(id: string, provider: string): Promise<User | null>;
  updateUser(user: User): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByResetToken(token: string): Promise<User | null>;
}
