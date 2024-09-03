import { CaseFile } from 'src/domain/Questionnaire/entities';
import { CaseFileResponseDto } from '../dtos';

export class CaseFileMapper {
  static toDomain(
    caseFileResponseDto: CaseFileResponseDto,
  ): CaseFileResponseDto {
    return {
      responses: caseFileResponseDto.responses,
    };
  }

  static toDto(caseFile: CaseFile): CaseFile {
    return {
      id: caseFile.id,
      mainComplaint: caseFile.mainComplaint,
      medicalHistory: caseFile.medicalHistory,
      eyeHistory: caseFile.eyeHistory,
      lastEyeExamination: caseFile.lastEyeExamination,
      allergies: caseFile.allergies,
      familyVisualHistory: caseFile.familyVisualHistory,
      familyMedicalHistory: caseFile.familyMedicalHistory,
      currentDrugUse: caseFile.currentDrugUse,
      user: caseFile.user,
      createdAt: caseFile.createdAt,
    };
  }
}
