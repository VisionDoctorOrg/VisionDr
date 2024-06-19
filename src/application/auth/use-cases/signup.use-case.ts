// src/application/auth/use-cases/signup.use-case.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthMapper } from '../mappers/auth.mapper';
import { SignupDto } from '../dtos/signup.dto';
import { AuthService } from 'src/domain/auth/services/auth.service';
import { User } from 'src/domain/admin/entities/user.entity';

@Injectable()
export class SignupUseCase {
  constructor(private readonly authService: AuthService) {}

  async execute(signupDto: SignupDto): Promise<User> {
    if (!signupDto.lastName || !signupDto.password || !signupDto.phone) {
      throw new HttpException("Missing field(s)", HttpStatus.BAD_REQUEST)
    }
    const user = await this.authService.signup(signupDto);
    return AuthMapper.toDto(user);
  }
}


