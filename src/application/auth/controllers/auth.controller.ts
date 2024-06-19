import { Controller, Post, Body } from '@nestjs/common';
import { AuthMapper } from '../mappers/auth.mapper';
import { SignupDto } from '../dtos/signup.dto';
import { LoginDto } from '../dtos/login.dto';
import { SignupUseCase } from '../use-cases/signup.use-case';
import { LoginUseCase } from '../use-cases/login.use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly signupUseCase: SignupUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}


  @Post('signup')
  async signup(@Body() signupDto: SignupDto): Promise<any> {
    const admin = await this.signupUseCase.execute(signupDto);
    return AuthMapper.toDto(admin);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    return this.loginUseCase.execute(loginDto);
  }
}
