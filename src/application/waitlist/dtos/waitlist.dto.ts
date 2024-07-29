import { IsEnum, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto, Type } from 'src/common';

export class WaitlistDto extends BaseDto {
  @ApiProperty({
    example: 'ABC Company',
    description: 'The Company name (required if type is Organization)',
    required: false,
  })
  @ValidateIf((o) => o.type === Type.Organization)
  @IsNotEmpty()
  @IsString()
  organizationName: string;

  @ApiProperty({
    example: 'Individual or Organization',
    description: 'Type of waitlist',
    required: true,
    enum: Type,
  })
  @IsNotEmpty()
  @IsEnum(Type)
  type: Type;
}

export class NewsLetterDto extends BaseDto {}
