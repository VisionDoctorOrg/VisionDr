import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAdditionalInfoDto {
  @ApiProperty({
    example: 'Current Visoin correction',
    description: 'Current Visoin correction',
  })
  @IsOptional()
  @IsString()
  currentVision?: string;

  @ApiProperty({
    example: 'Lifestyle and visual demand',
    description: 'Lifestyle and visual demand',
  })
  @IsOptional()
  @IsString()
  lifeStyle?: string;
}
