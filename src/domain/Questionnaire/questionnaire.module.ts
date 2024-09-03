import { Global, Module } from '@nestjs/common';
import { PrismaService } from 'src/common';
import { GlaucomaService, RefractiveErrorCheckService } from './services';
import {
  CaseFileController,
  CaseFileUseCase,
  GlaucomaController,
  GlaucomaUseCase,
  RefractiveErrorCheckController,
  RefractiveErrorCheckUseCase,
} from 'src/application/Questionnaire';
import {
  CaseFileRepository,
  GlaucomaRepository,
  RefractiveErrorCheckRepository,
} from './interfaces';
import { refractiveErrorCheckRepository } from 'src/infrastructure/repositories/refractiveErrorCheck.repository';
import { glaucomaRepository } from 'src/infrastructure/repositories/glaucoma.repository';
import { caseFileRepository } from 'src/infrastructure/repositories/caseFile.repository';
import { CaseFileService } from './services/caseFile.service';

@Global()
@Module({
  controllers: [
    RefractiveErrorCheckController,
    GlaucomaController,
    CaseFileController,
  ],
  providers: [
    RefractiveErrorCheckService,
    GlaucomaService,
    CaseFileService,
    PrismaService,
    RefractiveErrorCheckUseCase,
    GlaucomaUseCase,
    CaseFileUseCase,
    {
      provide: RefractiveErrorCheckRepository,
      useClass: refractiveErrorCheckRepository,
    },
    {
      provide: CaseFileRepository,
      useClass: caseFileRepository,
    },
    {
      provide: GlaucomaRepository,
      useClass: glaucomaRepository,
    },
  ],
  exports: [RefractiveErrorCheckService, GlaucomaService],
})
export class QuestionnaireModule {}
