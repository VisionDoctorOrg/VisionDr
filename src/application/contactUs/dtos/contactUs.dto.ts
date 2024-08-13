import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto, Type } from 'src/common';

export class ContactUsDto extends BaseDto {
  @ApiProperty({
    example: 'Contact us',
    description: 'Message Body',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  message: string;

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
