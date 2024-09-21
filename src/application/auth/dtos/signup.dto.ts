import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { BaseDto, Type } from 'src/common';

export class SignupDto extends BaseDto {
  @ApiProperty({
    example: 'StrongPassword123!',
    description: 'The password of the user',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    example: 'StrongPassword123!',
    description: 'Confirm password',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  confirmPassword: string;

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
    description: 'Type of user',
    required: true,
    enum: Type,
  })
  @IsNotEmpty()
  @IsEnum(Type)
  type: Type;

  @ApiProperty({
    example: '09087654322',
    description: 'User phone number',
    required: false,
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
