import { Glaucoma } from 'src/domain/Questionnaire/entities';
import { GlaucomaResponseDto } from '../dtos';

export class GlaucomaMapper {
  static toDomain(
    glaucomaResponseDto: GlaucomaResponseDto,
  ): GlaucomaResponseDto {
    return {
      responses: glaucomaResponseDto.responses,
    };
  }

  static toDto(glaucoma: Glaucoma): Glaucoma {
    return {
      id: glaucoma.id,
      eyeHealthHistory: glaucoma.eyeHealthHistory,
      lifestyleVisualDemands: glaucoma.lifestyleVisualDemands,
      visionSymptoms: glaucoma.visionSymptoms,
      additionalInformation: glaucoma.additionalInformation,
      user: glaucoma.user,
      createdAt: glaucoma.createdAt,
    };
  }
}
