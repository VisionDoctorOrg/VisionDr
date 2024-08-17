// src/domain/auth/auth.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from 'src/common';
import { userRepository } from 'src/infrastructure/repositories/users.repository';
import { UserRepository } from '../users/interfaces/user-repository.interface';
import { UsersService } from './services/users.service';

@Module({
  //controllers: [AuthController],
  providers: [
    UsersService,
    PrismaService,
    {
      provide: UserRepository,
      useClass: userRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
