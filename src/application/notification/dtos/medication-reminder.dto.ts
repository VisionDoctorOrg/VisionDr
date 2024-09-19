import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsString,
  IsBoolean,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class MedicationReminderTimeDto {
  @ApiProperty({
    description: 'The time of the reminder',
    example: '2024-09-18T10:00:00Z',
  })
  @IsDateString()
  reminderTime: string;

  @ApiProperty({
    description: 'Indicates if the medication has been taken for this time',
    example: false,
  })
  @IsBoolean()
  completed: boolean;
}

export class MedicationReminderDto {
  @ApiProperty({
    description: 'The name of the medication',
    example: 'Yeast Eye drop',
  })
  @IsString()
  medicationName: string;

  @ApiProperty({
    description: 'The type of medication (e.g., capsule, eye drops)',
    example: 'Eye Drops',
  })
  @IsString()
  medicationType: string;

  @ApiProperty({
    description: 'The dosage of the medication',
    example: '2 Drops',
  })
  @IsString()
  dosage: string;

  @ApiProperty({
    description:
      'The total duration in days or hours the medication needs to be taken',
    example: 7,
  })
  @IsInt()
  duration: number;

  @ApiProperty({
    description: 'The array of reminder times for this medication',
    type: [MedicationReminderTimeDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  // Necessary for proper transformation in nested objects
  @Type(() => MedicationReminderTimeDto)
  reminderTimes: MedicationReminderTimeDto[];
}
