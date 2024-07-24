import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BaseDto } from 'src/common';

export class LoginDto extends BaseDto {
  @ApiProperty({
    example: 'StrongPassword123!',
    description: 'The password of the user',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
