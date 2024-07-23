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

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    JwtAuthService,
    SignupUseCase,
    LoginUseCase,
    AuthMapper,
    {
      provide: UserRepository,
      useClass: UserRepo,
    },
  ],
})
export class AuthModule {}
