import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum Type {
  Individual = 'Individual',
  Organization = 'Organization',
}

export class WaitListBaseDto {
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
