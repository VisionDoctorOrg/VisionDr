import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BaseDto } from 'src/common';

export class LoginDto {
  // @ApiProperty({
  //   example: 'StrongPassword123!',
  //   description: 'The password of the user',
  //   required: true,
  // })
  // @IsNotEmpty()
  // @IsString()
  // password: string;

  // @ApiProperty({
  //   example: 'john.doe@example.com',
  //   description: 'The email of the user',
  //   required: true,
  // })
  // @IsNotEmpty()
  // @IsEmail()
  // email: string;


  @ApiProperty({
    example: 'StrongPassword123!',
    description: 'The password of the user',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    example: 'abc@gmail.com or 0908765643!',
    description: 'The email or phone number of the user',
    required: true,
  })
  @IsNotEmpty()
  username: string
}
