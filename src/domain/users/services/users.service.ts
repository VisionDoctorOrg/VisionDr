import { Inject, Injectable } from '@nestjs/common';
import { AuthProvider } from '@prisma/client';
import { User } from 'src/domain/users/entities/user.entity';
import { UserRepository } from 'src/domain/users/interfaces/user-repository.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository,
  ) {}

  async create(user: User): Promise<User> {
    console.log(user);
    return await this.userRepository.create(user);
  }

  async updateUser(user: User): Promise<User> {
    return await this.userRepository.updateUser(user);
  }

  async findUserById(userId: string): Promise<User | null> {
    const user = await this.userRepository.findById(userId);
    if (user) {
      return user;
    }
    return null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    if (user) {
      return user;
    }
    return null;
  }

  async findByProviderId(
    providerId: string,
    provider: AuthProvider,
  ): Promise<User | null> {
    const user = await this.userRepository.findByProviderId(
      providerId,
      provider,
    );
    if (user) {
      return user;
    }
    return null;
  }

  async findByResetToken(token: string): Promise<User | null> {
    return this.userRepository.findByResetToken(token);
  }
}
