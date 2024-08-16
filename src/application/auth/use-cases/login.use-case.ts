import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/domain/auth/services/auth.service';
import { AuthMapper } from '../mappers/auth.mapper';
import { LoginResponse } from '../interface/response-interface';
import { User } from '@prisma/client';

@Injectable()
export class LoginUseCase {
  constructor(private readonly authService: AuthService) {}

  async execute(data: User): Promise<LoginResponse> {
    const { user, accessToken } = await this.authService.login(data.email);
    const loginResponse = AuthMapper.toLoginDto(user, accessToken);
    return loginResponse;
  }
}
