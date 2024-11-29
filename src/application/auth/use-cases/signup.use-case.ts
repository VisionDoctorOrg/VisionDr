// src/application/auth/use-cases/signup.use-case.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { AuthMapper } from '../mappers/auth.mapper';
import { SignupDto } from '../dtos/signup.dto';
import { AuthService } from 'src/domain/auth/services/auth.service';
import { User } from 'src/domain/users/entities/user.entity';
import { MailService } from 'src/common/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { Status } from '@prisma/client';

@Injectable()
export class SignupUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  async execute(signupDto: SignupDto): Promise<User> {
    if (!signupDto.password) {
      throw new HttpException('Missing field(s)', HttpStatus.BAD_REQUEST);
    }

    if (!signupDto.email && !signupDto.phoneNumber) {
      throw new HttpException(
        'Either email or phone number must be provided',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.authService.signup(signupDto);

    // Generate activation token
    const token = randomBytes(32).toString('hex');
    user.token = token;
    user.tokenExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    user.subscriptionActive = Status.Active;

    // Save user with token details
    await this.authService.updateUser(user);

    // Send activation email
    const activationUrl = `${this.configService.get<string>('FRONT_URL')}/auth/activate?token=${token}`;
    await this.mailService.sendActivationEmail(
      user.email,
      user.fullName,
      activationUrl,
    );

    return AuthMapper.toDto(user);
  }

  async executeVerification(token: string): Promise<any> {
    const user = await this.authService.verifyToken(token);
    return AuthMapper.toDto(user);
  }
}
