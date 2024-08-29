import { Injectable } from '@nestjs/common';
import { RefractiveErrorCheckResponseDto } from '../dtos';
import { RefractiveErrorCheckMapper } from '../mappers';
import { RefractiveErrorCheckService } from 'src/domain/refractiveErrorCheck/services/refractiveErrorCheck.service';

@Injectable()
export class RefractiveErrorCheckUseCase {
  constructor(
    private readonly refractiveErrorCheckService: RefractiveErrorCheckService,
  ) {}

  async execute(
    id: string,
    refractiveErrorCheckResponseDto: RefractiveErrorCheckResponseDto,
  ): Promise<any> {
    const refractiveErrorCheck =
      await this.refractiveErrorCheckService.createQuestionnaire(
        id,
        refractiveErrorCheckResponseDto,
      );

    return RefractiveErrorCheckMapper.toDto(refractiveErrorCheck);
  }
}
