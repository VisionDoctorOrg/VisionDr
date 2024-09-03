import {
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsString,
  IsObject,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class QuestionAnswerDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The question being asked',
    example: 'Do you currently wear glasses or contact lenses?',
  })
  question: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The answer provided by the user',
    example: 'Yes, I wear glasses for reading.',
  })
  answer: string;
}

class ResponsesDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionAnswerDto)
  @ApiProperty({
    type: [QuestionAnswerDto],
    description: 'main Information',
  })
  mainComplaint?: QuestionAnswerDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionAnswerDto)
  @ApiProperty({ type: [QuestionAnswerDto], description: 'eye Health History' })
  eyeHistory?: QuestionAnswerDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionAnswerDto)
  @ApiProperty({
    type: [QuestionAnswerDto],
    description: 'Medical Health History',
  })
  medicalHistory?: QuestionAnswerDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionAnswerDto)
  @ApiProperty({
    type: [QuestionAnswerDto],
    description: 'Last Eye Examination',
  })
  lastEyeExamination?: QuestionAnswerDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionAnswerDto)
  @ApiProperty({
    type: [QuestionAnswerDto],
    description: 'Family Visual History',
  })
  familyVisualHistory?: QuestionAnswerDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionAnswerDto)
  @ApiProperty({
    type: [QuestionAnswerDto],
    description: 'Family Medical History',
  })
  familyMedicalHistory?: QuestionAnswerDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionAnswerDto)
  @ApiProperty({
    type: [QuestionAnswerDto],
    description: 'Allergies',
  })
  allergies?: QuestionAnswerDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionAnswerDto)
  @ApiProperty({
    type: [QuestionAnswerDto],
    description: 'Current Drug Use',
  })
  currentDrugUse?: QuestionAnswerDto[];
}

export class CaseFileResponseDto {
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => ResponsesDto)
  @ApiProperty({
    type: ResponsesDto,
    description:
      'Object containing user responses grouped by each step of the casefile questionnaire',
  })
  responses: ResponsesDto;
}
