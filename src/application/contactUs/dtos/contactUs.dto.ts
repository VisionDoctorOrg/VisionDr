import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
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
}
