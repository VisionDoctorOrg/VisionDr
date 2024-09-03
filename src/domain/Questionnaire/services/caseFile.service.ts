import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CaseFileRepository } from '../interfaces';
import { CaseFileResponseDto } from 'src/application/Questionnaire';
import { UsersService } from 'src/domain/users/services/users.service';
import { CaseFile, Glaucoma } from '../entities';

@Injectable()
export class CaseFileService {
  constructor(
    @Inject(CaseFileRepository)
    private readonly caseFileRepository: CaseFileRepository,
    private readonly usersService: UsersService,
  ) {}

  async createQuestionnaire(
    id: string,
    caseFileResponseDto: CaseFileResponseDto,
  ): Promise<CaseFile> {
    const { responses } = caseFileResponseDto;
    const user = await this.usersService.findUserById(id);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const caseFile = await this.caseFileRepository.findCaseFileByUserId(
      user.id,
    );

    if (caseFile) {
      throw new HttpException(
        'Response already completed',
        HttpStatus.BAD_REQUEST,
      );
    }

    const dataToSave = {
      userId: user.id,
      mainComplaint: responses.mainComplaint,
      medicalHistory: responses.medicalHistory,
      eyeHistory: responses.eyeHistory,
      lastEyeExamination: responses.lastEyeExamination,
      allergies: responses.allergies,
      familyVisualHistory: responses.familyVisualHistory,
      familyMedicalHistory: responses.familyMedicalHistory,
      currentDrugUse: responses.currentDrugUse,
    };

    return await this.caseFileRepository.create(dataToSave);
  }
}
