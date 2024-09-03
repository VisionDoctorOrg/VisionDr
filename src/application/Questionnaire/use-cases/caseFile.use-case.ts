import { Injectable } from '@nestjs/common';
import { CaseFileResponseDto, GlaucomaResponseDto } from '../dtos';
import { CaseFileMapper, GlaucomaMapper } from '../mappers';
//import { GlaucomaService } from 'src/domain/Questionnaire';
import { CaseFileService } from 'src/domain/Questionnaire/services/caseFile.service';

@Injectable()
export class CaseFileUseCase {
  constructor(private readonly caseFileService: CaseFileService) {}

  async execute(
    id: string,
    CaseFileResponseDto: CaseFileResponseDto,
  ): Promise<any> {
    const caseFile = await this.caseFileService.createQuestionnaire(
      id,
      CaseFileResponseDto,
    );

    return CaseFileMapper.toDto(caseFile);
  }
}
