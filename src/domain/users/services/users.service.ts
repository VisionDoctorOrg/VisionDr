import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/domain/users/entities/user.entity';
import { UserRepository } from 'src/domain/users/interfaces/user-repository.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository,
  ) {}

  async findUserById(userId: string): Promise<User | null> {
    const user = await this.userRepository.findById(userId);
    if (user) {
      return user;
    }
    return null;
  }
}
