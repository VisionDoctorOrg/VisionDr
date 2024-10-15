// src/domain/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthController } from '../../application/auth/controllers/auth.controller';
import { SignupUseCase } from '../../application/auth/use-cases/signup.use-case';
import { LoginUseCase } from '../../application/auth/use-cases/login.use-case';
import { AuthMapper } from '../../application/auth/mappers/auth.mapper';
import { AuthService } from './services/auth.service';
import { JwtAuthService } from 'src/common';
import { userRepository } from 'src/infrastructure/repositories/users.repository';
import { UserRepository } from '../users/interfaces/user-repository.interface';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy, LocalStrategy } from './strategies';
import { UsersService } from '../users/services/users.service';
import { ResetPasswordUseCase } from 'src/application/auth/use-cases/reset-password.use-case';
import { ForgotPasswordUseCase } from 'src/application/auth/use-cases/forgot-password.use-case';
import { MailService } from 'src/common/mail/mail.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { LinkedInStrategy } from './strategies/linkedin.strategy';
import { PassportModule } from '@nestjs/passport';
import { SubscriptionService } from '../subscription/services';
import { SubscriptionRepository } from '../subscription/interfaces';
import { subscriptionRepository } from 'src/infrastructure/repositories/subscription.repository';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    PassportModule,
    HttpModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION')}s`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    MailService,
    SubscriptionService,
    JwtAuthService,
    SignupUseCase,
    LoginUseCase,
    ResetPasswordUseCase,
    ForgotPasswordUseCase,
    AuthMapper,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    LinkedInStrategy,
    {
      provide: UserRepository,
      useClass: userRepository,
    },
    {
      provide: SubscriptionRepository,
      useClass: subscriptionRepository,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
