import { Injectable } from '@nestjs/common';
import { User } from 'src/domain/users/entities/user.entity';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UsersMapper } from '../mappers/users.mapper';
import { UsersService } from 'src/domain/users/services/users.service';

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly usersService: UsersService) {}

  async execute(
    userId: string,
    updateUserDto: UpdateUserDto,
    file: Express.Multer.File,
  ): Promise<User> {
    const user = await this.usersService.updateUserProfile(
      userId,
      updateUserDto,
      file,
    );
    return UsersMapper.toDto(user);
  }
}
