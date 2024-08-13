// src/domain/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthController } from '../../application/auth/controllers/auth.controller';
import { SignupUseCase } from '../../application/auth/use-cases/signup.use-case';
import { LoginUseCase } from '../../application/auth/use-cases/login.use-case';
import { AuthMapper } from '../../application/auth/mappers/auth.mapper';
import { AuthService } from './services/auth.service';
import { JwtAuthService, PrismaService } from 'src/common';
import { UserRepo } from 'src/infrastructure/repositories/users.repository';
import { UserRepository } from '../users/interfaces/user-repository.interface';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy, LocalStrategy } from './strategies';
import { UsersService } from '../users/services/users.service';

@Module({
  imports: [
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
    PrismaService,
    JwtAuthService,
    SignupUseCase,
    LoginUseCase,
    AuthMapper,
    LocalStrategy,
    JwtStrategy,
    {
      provide: UserRepository,
      useClass: UserRepo,
    },
  ],
})
export class AuthModule {}
