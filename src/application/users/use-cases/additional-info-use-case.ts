import { Injectable } from '@nestjs/common';
import { UsersMapper } from '../mappers/users.mapper';
import { UsersService } from 'src/domain/users/services/users.service';
import { UpdateAdditionalInfoDto } from '../dtos/additional-info.dto';
import { AdditionalInformation } from '@prisma/client';

@Injectable()
export class AdditionalInforUseCase {
  constructor(private readonly usersService: UsersService) {}

  async execute(
    userId: string,
    updateAdditionalInfoDto: UpdateAdditionalInfoDto,
  ): Promise<AdditionalInformation> {
    const existingInfo = await this.usersService.getAdditionalInfo(userId);

    if (existingInfo) {
      return await this.usersService.updateAdditionalInformation(
        existingInfo.id,
        updateAdditionalInfoDto,
      );
    }

    const info = await this.usersService.createAdditionalInfo(
      userId,
      updateAdditionalInfoDto,
    );
    return UsersMapper.additionalInfoDto(info);
  }
}
