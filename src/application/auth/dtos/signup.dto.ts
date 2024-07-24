import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { BaseDto } from 'src/common';

export class SignupDto extends BaseDto {
  @ApiProperty({
    example: 'John',
    description: 'The first name of the user',
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the user',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  lastName?: string;

  @ApiProperty({
    example: 'StrongPassword123!',
    description: 'The password of the user',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
