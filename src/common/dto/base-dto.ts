import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class BaseDto   {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @Matches(/^(\+234|0)[789]\d{9}$/, {
    message: 'phoneNumber must be a valid phone number',
  })
  phone?: string;

  @IsOptional()
  @IsString()
  password?: string;
}
