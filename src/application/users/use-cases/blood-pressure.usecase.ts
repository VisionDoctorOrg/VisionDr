import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/domain/users/services/users.service';
import { BloodPressure } from '@prisma/client';
import { CreateBloodPressureDto } from '../dtos';

@Injectable()
export class BloodPressureUseCase {
  constructor(private readonly usersService: UsersService) {}

  async execute(
    userId: string,
    CreateBloodPressureDto: CreateBloodPressureDto,
  ): Promise<BloodPressure> {
    const existingBloodPressure = await this.usersService.getBloodPressure(userId);

    if (existingBloodPressure) {
      return await this.usersService.updateBloodPressure(
        existingBloodPressure.id,
        CreateBloodPressureDto,
      );
    }

    return await this.usersService.createBloodPressure(
      userId,
      CreateBloodPressureDto,
    );
  }
}
