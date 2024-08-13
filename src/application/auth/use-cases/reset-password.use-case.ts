import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/domain/auth/services/auth.service';
import { AuthMapper } from '../mappers/auth.mapper';
import { SignupResponse } from '../interface/response-interface';
import { ResetPasswordDto } from '../dtos/reset-password.dto';

@Injectable()
export class ResetPasswordUseCase {
  constructor(private readonly authService: AuthService) {}

  async execute(resetPasswordDto: ResetPasswordDto): Promise<SignupResponse> {
    const user = await this.authService.resetPassword(resetPasswordDto);
    return AuthMapper.toDto(user);
  }
}