import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBloodPressureDto {
  @ApiProperty({
    example: 120,
    description: 'The systolic value of the blood pressure measurement',
  })
  @IsInt()
  @IsNotEmpty()
  systolic: number;

  @ApiProperty({
    example: 80,
    description: 'The diastolic value of the blood pressure measurement',
  })
  @IsInt()
  @IsNotEmpty()
  diastolic: number;
}
