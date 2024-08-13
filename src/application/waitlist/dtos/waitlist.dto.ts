import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
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

  @ApiProperty({
    example: '+2347012345678',
    description: 'The phone number of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class NewsLetterDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
