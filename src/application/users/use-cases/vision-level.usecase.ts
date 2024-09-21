import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/domain/users/services/users.service';
import { VisionLevel } from '@prisma/client';
import { CreateVisionDto } from '../dtos';

@Injectable()
export class VisionLevelUseCase {
  constructor(private readonly usersService: UsersService) {}

  async execute(
    userId: string,
    createVisionDto: CreateVisionDto,
  ): Promise<VisionLevel> {
    const existingVisionLevel = await this.usersService.getVisionLevel(userId);

    if (existingVisionLevel) {
      return await this.usersService.updateVisionLevel(
        existingVisionLevel.id,
        createVisionDto,
      );
    }

    return await this.usersService.createVisionLevel(
      userId,
      createVisionDto,
    );
  }
}
