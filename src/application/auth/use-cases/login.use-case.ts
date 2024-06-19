// src/application/auth/use-cases/login.use-case.ts
import { Injectable } from '@nestjs/common';
import { LoginDto } from '../dtos/login.dto';
import { AuthService } from 'src/domain/auth/services/auth.service';
// import { AuthService } from 'src/domain/auth/services/auth.service';

@Injectable()
export class LoginUseCase {
  constructor(private readonly authService: AuthService) {}

  async execute(loginDto: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.login(loginDto);
  }
}