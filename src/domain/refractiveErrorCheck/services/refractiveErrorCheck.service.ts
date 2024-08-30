import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RefractiveErrorCheckRepository } from '../interfaces';
import { RefractiveErrorCheckResponseDto } from 'src/application/refractiveErrorCheck';
import { UsersService } from 'src/domain/users/services/users.service';
import { RefractiveErrorCheck } from '../entities';

@Injectable()
export class RefractiveErrorCheckService {
  constructor(
    @Inject(RefractiveErrorCheckRepository)
    private readonly refractiveErrorCheckRepository: RefractiveErrorCheckRepository,
    private readonly usersService: UsersService,
  ) {}

  async createQuestionnaire(
    id: string,
    refractiveErrorCheckResponseDto: RefractiveErrorCheckResponseDto,
  ): Promise<RefractiveErrorCheck> {
    const { responses } = refractiveErrorCheckResponseDto;
    const user = await this.usersService.findUserById(id);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const refractiveErrorCheck =
      await this.refractiveErrorCheckRepository.findRefractiveErrorCheckByUserId(
        user.id,
      );

    if (refractiveErrorCheck) {
      throw new HttpException(
        'Response already completed',
        HttpStatus.BAD_REQUEST,
      );
    }

    const dataToSave = {
      userId: user.id,
      medicalHistory: responses.medicalHistory,
      visionSymptoms: responses.visionSymptoms,
      currentVisionCorrection: responses.currentVisionCorrection,
      lifestyleVisualDemands: responses.lifestyleVisualDemands,
      additionalInformation: responses.additionalInformation,
    };

    return await this.refractiveErrorCheckRepository.create(dataToSave);
  }
}
