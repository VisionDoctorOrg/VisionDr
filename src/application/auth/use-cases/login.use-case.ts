import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from 'src/domain/auth/services/auth.service';
import { AuthMapper } from '../mappers/auth.mapper';
import { User } from 'src/domain/users/entities/user.entity';
import { Status } from '@prisma/client';

@Injectable()
export class LoginUseCase {
  constructor(private readonly authService: AuthService) {}

  async execute(data: User): Promise<User> {
    const identifier: string = data.email ? data.email : data.phoneNumber;

    const { user, accessToken } = await this.authService.login(identifier);
    if (user.activated && user.activated === Status.Inactive) {
      throw new HttpException('Account not activated', HttpStatus.BAD_REQUEST);
    } else if (user.activated && user.activated === Status.Deactivated) {
      throw new HttpException('Account  Deactivated', HttpStatus.BAD_REQUEST);
    }
    const loginResponse = AuthMapper.toLoginDto(user, accessToken);

    return loginResponse;
  }
}
