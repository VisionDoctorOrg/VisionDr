import { Injectable } from '@nestjs/common';
import { GlaucomaResponseDto } from '../dtos';
import { GlaucomaMapper } from '../mappers';
//import { GlaucomaService } from 'src/domain/Questionnaire';
import { GlaucomaService } from 'src/domain/Questionnaire/services/glaucoma.service';

@Injectable()
export class GlaucomaUseCase {
  constructor(private readonly glaucomaService: GlaucomaService) {}

  async execute(
    id: string,
    glaucomaResponseDto: GlaucomaResponseDto,
  ): Promise<any> {
    const glaucoma = await this.glaucomaService.createQuestionnaire(
      id,
      glaucomaResponseDto,
    );

    return GlaucomaMapper.toDto(glaucoma);
  }
}
