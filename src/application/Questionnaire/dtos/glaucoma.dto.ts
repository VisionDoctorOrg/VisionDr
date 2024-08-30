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
    description: 'Personal Information',
  })
  personalInformation?: QuestionAnswerDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionAnswerDto)
  @ApiProperty({ type: [QuestionAnswerDto], description: 'eye Health History' })
  eyeHealthHistory?: QuestionAnswerDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionAnswerDto)
  @ApiProperty({ type: [QuestionAnswerDto], description: 'Vision Symptoms' })
  visionSymptoms?: QuestionAnswerDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionAnswerDto)
  @ApiProperty({
    type: [QuestionAnswerDto],
    description: 'Lifestyle and Visual Demands',
  })
  lifestyleVisualDemands?: QuestionAnswerDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionAnswerDto)
  @ApiProperty({
    type: [QuestionAnswerDto],
    description: 'Additional Information',
  })
  additionalInformation?: QuestionAnswerDto[];
}

export class GlaucomaResponseDto {
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => ResponsesDto)
  @ApiProperty({
    type: ResponsesDto,
    description:
      'Object containing user responses grouped by each step of the refractive error check questionnaire',
  })
  responses: ResponsesDto;
}
