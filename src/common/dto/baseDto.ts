import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BaseDto {
  @ApiProperty({
    example: 'John Gabriel',
    description: 'The full name of the user',
  })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '+2347012345678',
    description: 'The phone number of the user',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^(\+234|0)[789]\d{9}$/, {
    message: 'phoneNumber must be a valid phone number',
  })
  phone: string;
}
