import { Global, Module } from '@nestjs/common';
import { CloudinaryModule, CloudinaryService, PrismaService } from 'src/common';
import { userRepository } from 'src/infrastructure/repositories/users.repository';
import { UserRepository } from '../users/interfaces/user-repository.interface';
import { UsersService } from './services/users.service';
import { UsersController } from 'src/application/users/controllers/user.controller';
import { UpdateUserUseCase } from 'src/application/users/use-cases/update-user-profile-use-case';
import { AdditionalInforUseCase } from 'src/application/users/use-cases/additional-info-use-case';

@Global()
@Module({
  imports: [CloudinaryModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaService,
    CloudinaryService,
    UpdateUserUseCase,
    AdditionalInforUseCase,
    {
      provide: UserRepository,
      useClass: userRepository,
    },
  ],
  exports: [UsersService, CloudinaryService, PrismaService],
})
export class UsersModule {}
