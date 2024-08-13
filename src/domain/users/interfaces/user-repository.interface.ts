import { IRepository } from 'src/common';
import { User } from '../entities/user.entity';
export const UserRepository = Symbol('UserRepository');

export interface UserRepository extends IRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  updateUser(user: User): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByResetToken(token: string): Promise<User | null>;
}
