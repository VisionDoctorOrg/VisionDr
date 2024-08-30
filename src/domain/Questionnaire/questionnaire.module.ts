import { Global, Module } from '@nestjs/common';
import { PrismaService } from 'src/common';
import { GlaucomaService, RefractiveErrorCheckService } from './services';
import {
  GlaucomaController,
  GlaucomaUseCase,
  RefractiveErrorCheckController,
  RefractiveErrorCheckUseCase,
} from 'src/application/Questionnaire';
import {
  GlaucomaRepository,
  RefractiveErrorCheckRepository,
} from './interfaces';
import { refractiveErrorCheckRepository } from 'src/infrastructure/repositories/refractiveErrorCheck.repository';
import { glaucomaRepository } from 'src/infrastructure/repositories/glaucoma.repository';
//import { RefractiveErrorCheckService } from './services/refractiveErrorCheck.service';

@Global()
@Module({
  controllers: [RefractiveErrorCheckController, GlaucomaController],
  providers: [
    RefractiveErrorCheckService,
    GlaucomaService,
    PrismaService,
    RefractiveErrorCheckUseCase,
    GlaucomaUseCase,
    {
      provide: RefractiveErrorCheckRepository,
      useClass: refractiveErrorCheckRepository,
    },
    {
      provide: GlaucomaRepository,
      useClass: glaucomaRepository,
    },
  ],
  exports: [RefractiveErrorCheckService, GlaucomaService],
})
export class QuestionnaireModule {}
