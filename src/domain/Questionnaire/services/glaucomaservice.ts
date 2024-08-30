import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { GlaucomaRepository } from '../interfaces';
import { GlaucomaResponseDto } from 'src/application/Questionnaire';
import { UsersService } from 'src/domain/users/services/users.service';
import { Glaucoma } from '../entities';

@Injectable()
export class GlaucomaService {
  constructor(
    @Inject(GlaucomaRepository)
    private readonly glaucomaRepository: GlaucomaRepository,
    private readonly usersService: UsersService,
  ) {}

  async createQuestionnaire(
    id: string,
    glaucomaResponseDto: GlaucomaResponseDto,
  ): Promise<Glaucoma> {
    const { responses } = glaucomaResponseDto;
    const user = await this.usersService.findUserById(id);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const glaucoma = await this.glaucomaRepository.findGlaucomaByUserId(
      user.id,
    );

    if (glaucoma) {
      throw new HttpException(
        'Response already completed',
        HttpStatus.BAD_REQUEST,
      );
    }

    const dataToSave = {
      userId: user.id,
      eyeHealthHistory: responses.eyeHealthHistory,
      visionSymptoms: responses.visionSymptoms,
      lifestyleVisualDemands: responses.lifestyleVisualDemands,
      additionalInformation: responses.additionalInformation,
    };

    return await this.glaucomaRepository.create(dataToSave);
  }
}
