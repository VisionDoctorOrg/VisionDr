// src/application/auth/dto/login.dto.ts

import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto  {
  @IsNotEmpty()
  @IsEmail()
   email: string;

  @IsNotEmpty()
  @IsString()
   password: string;
}
