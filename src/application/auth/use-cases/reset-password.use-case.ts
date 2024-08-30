import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/domain/auth/services/auth.service';
import { AuthMapper } from '../mappers/auth.mapper';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { User } from 'src/domain/users/entities/user.entity';

@Injectable()
export class ResetPasswordUseCase {
  constructor(private readonly authService: AuthService) {}

  async execute(resetPasswordDto: ResetPasswordDto): Promise<any> {
    const user = await this.authService.resetPassword(resetPasswordDto);
    return AuthMapper.toDto(user);
  }
}
