import { RefractiveErrorCheck } from 'src/domain/refractiveErrorCheck/entities';
import { RefractiveErrorCheckResponseDto } from '../dtos';

export class RefractiveErrorCheckMapper {
  static toDomain(
    refractiveErrorCheckResponseDto: RefractiveErrorCheckResponseDto,
  ): RefractiveErrorCheckResponseDto {
    return {
      responses: refractiveErrorCheckResponseDto.responses,
    };
  }

  static toDto(
    refractiveErrorCheck: RefractiveErrorCheck,
  ): RefractiveErrorCheck {
    return {
      id: refractiveErrorCheck.id,
      medicalHistory: refractiveErrorCheck.medicalHistory,
      currentVisionCorrection: refractiveErrorCheck.currentVisionCorrection,
      lifestyleVisualDemands: refractiveErrorCheck.lifestyleVisualDemands,
      visionSymptoms: refractiveErrorCheck.visionSymptoms,
      additionalInformation: refractiveErrorCheck.additionalInformation,
      user: refractiveErrorCheck.user,
      createdAt: refractiveErrorCheck.createdAt,
    };
  }
}
