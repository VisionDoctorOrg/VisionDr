import { Global, Module } from '@nestjs/common';
import { PrismaService } from 'src/common';
import { RefractiveErrorCheckService } from './services/refractiveErrorCheck.service';
import {
  RefractiveErrorCheckController,
  RefractiveErrorCheckUseCase,
} from 'src/application/refractiveErrorCheck';
import { refractiveErrorCheckRepository } from 'src/infrastructure/repositories/refractiveErrorCheck.repository';
import { RefractiveErrorCheckRepository } from './interfaces';

@Global()
@Module({
  // imports: [CloudinaryModule],
  controllers: [RefractiveErrorCheckController],
  providers: [
    RefractiveErrorCheckService,
    PrismaService,
    RefractiveErrorCheckUseCase,
    {
      provide: RefractiveErrorCheckRepository,
      useClass: refractiveErrorCheckRepository,
    },
  ],
  exports: [RefractiveErrorCheckService],
})
export class RefractiveErrorCheckModule {}
