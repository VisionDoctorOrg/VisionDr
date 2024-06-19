import { IRepository } from "src/common";
import { User } from "../entities/user.entity";
export const UserRepository = Symbol('UserRepository');

export interface UserRepository extends IRepository<User> {
    findByEmail(email: string): Promise<User | null>;
    findByEmailOrPhone(email: string, phone: string): Promise<User | null>;
}
