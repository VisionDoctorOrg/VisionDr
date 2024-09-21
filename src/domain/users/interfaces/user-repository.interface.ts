import { IRepository } from 'src/common';
import { User } from '../entities/user.entity';
import { UpdateAdditionalInfoDto } from 'src/application/users/dtos/additional-info.dto';
import { AdditionalInformation } from '@prisma/client';
export const UserRepository = Symbol('UserRepository');

export interface UserRepository extends IRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  findByPhoneNumber(email: string): Promise<User | null>;
  findByProviderId(id: string, provider: string): Promise<User | null>;
  findByEmailOrPhone(email: string, phoneNumber: string): Promise<User | null>;
  updateUser(user: User): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByResetToken(token: string): Promise<User | null>;
  getAdditionalInfo(userId: string): Promise<AdditionalInformation | null>;
  updateAdditionalInformation(
    id: string,
    info: UpdateAdditionalInfoDto,
  ): Promise<AdditionalInformation | null>;
  createAdditionalInfo(
    userId: string,
    updateAdditionalInfoDto: UpdateAdditionalInfoDto,
  ): Promise<AdditionalInformation>;
}
