import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ColorVisionLevel {
  NORMAL = 'Normal',
  ABNORMAL = 'Abnormal',
}

export class CreateVisionDto {
  @ApiProperty({
    description: 'Color vision level',
    example: 'Normal',
    enum: ColorVisionLevel,
  })
  @IsEnum(ColorVisionLevel)
  visionLevel: ColorVisionLevel;
}
