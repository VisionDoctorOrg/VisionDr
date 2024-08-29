import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BaseDto } from 'src/common';

export class UpdateUserDto {
  @ApiProperty({
    example: '01/01/1990',
    description: 'Date of Birth',
  })
  @IsOptional()
  @IsString()
  DOB?: string;

  @ApiProperty({
    example: 'Male/Female',
    description: 'Users Gender',
  })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({
    example: 'Developer',
    description: 'Users occupation',
  })
  @IsOptional()
  @IsString()
  occupation?: string;

  @ApiProperty({
    example: 'Reading, Coding etc',
    description: 'Users hobbies',
  })
  @IsOptional()
  @IsString()
  hobbies?: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user',
  })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address of the user',
  })
  @IsOptional()
  @IsString()
  email: string;
}
