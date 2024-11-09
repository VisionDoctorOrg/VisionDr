import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from 'src/domain/auth/services/auth.service';
import { randomBytes } from 'crypto';
import { MailService } from 'src/common/mail/mail.service';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { ConfigService } from '@nestjs/config';
import { response } from 'src/common';
import { User } from 'src/domain/users/entities/user.entity';

@Injectable()
export class ForgotPasswordUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async execute(forgotPasswordDto: ForgotPasswordDto): Promise<User> {
    const user = await this.authService.findByEmail(forgotPasswordDto.email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString('hex'); 
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const response = await this.authService.updateUser(user);

    // Send reset email
    const resetUrl = `${this.configService.get<string>('FRONT_URL')}/reset-password?token=${resetToken}`;
    await this.mailService.sendResetPasswordEmail(
      user.email,
      user.fullName,
      resetUrl,
    );

    return response;
  }
}
