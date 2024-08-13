import { Injectable } from '@nestjs/common';
import { LoginDto } from '../dtos/login.dto';
import { AuthService } from 'src/domain/auth/services/auth.service';
import { AuthMapper } from '../mappers/auth.mapper';
import { LoginResponse } from '../interface/response-interface';

@Injectable()
export class LoginUseCase {
  constructor(private readonly authService: AuthService) {}

  async execute(loginDto: LoginDto): Promise<LoginResponse> {
    const { user, accessToken } = await this.authService.login(loginDto);
    const loginResponse = AuthMapper.toLoginDto(user, accessToken);
    return loginResponse;
  }
}
