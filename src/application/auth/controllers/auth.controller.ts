import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { AuthMapper } from '../mappers/auth.mapper';
import { SignupDto } from '../dtos/signup.dto';
import { LoginDto } from '../dtos/login.dto';
import { SignupUseCase } from '../use-cases/signup.use-case';
import { LoginUseCase } from '../use-cases/login.use-case';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly signupUseCase: SignupUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User successfully registered.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  async signup(@Body() signupDto: SignupDto): Promise<any> {
    const admin = await this.signupUseCase.execute(signupDto);
    return AuthMapper.toDto(admin);
  }

  @Post('login')
  @ApiOperation({ summary: 'Authenticate a user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User successfully authenticated.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    return this.loginUseCase.execute(loginDto);
  }
}
