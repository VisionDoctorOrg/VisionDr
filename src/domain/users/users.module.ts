// src/domain/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common';
import { UserRepo } from 'src/infrastructure/repositories/users.repository';
import { UserRepository } from '../users/interfaces/user-repository.interface';

@Module({
  //controllers: [AuthController],
  providers: [
    PrismaService,
    {
      provide: UserRepository,
      useClass: UserRepo,
    },
  ],
})
export class UsersModule {}
