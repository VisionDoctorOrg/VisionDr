import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/domain/auth/services/auth.service';
import { AuthMapper } from '../mappers/auth.mapper';
import { User } from 'src/domain/users/entities/user.entity';

@Injectable()
export class LoginUseCase {
  constructor(private readonly authService: AuthService) {}

  async execute(data: User): Promise<User> {
    const identifier: string = data.email ? data.email : data.phoneNumber;
    const { user, accessToken } = await this.authService.login(identifier);
    const loginResponse = AuthMapper.toLoginDto(user, accessToken);

    return loginResponse;
  }
}
