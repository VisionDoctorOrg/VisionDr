import {
  Controller,
  Post,
  Body,
  HttpStatus,
  UseGuards,
  Get,
  Req,
  Request,
} from '@nestjs/common';
import { SignupDto } from '../dtos/signup.dto';
import { LoginDto } from '../dtos/login.dto';
import { SignupUseCase } from '../use-cases/signup.use-case';
import { LoginUseCase } from '../use-cases/login.use-case';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GoogleOauthGuard, LocalAuthGuard } from 'src/domain/auth/guards';
import { LoginResponse, response } from '../interface/response-interface';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { ForgotPasswordUseCase } from '../use-cases/forgot-password.use-case';
import { ResetPasswordUseCase } from '../use-cases/reset-password.use-case';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly signupUseCase: SignupUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully registered.',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  async signup(@Body() signupDto: SignupDto): Promise<response> {
    const user = await this.signupUseCase.execute(signupDto);
    return {
      status: true,
      message: 'Signup successfully',
      ...user,
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Authenticate a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully authenticated.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  async login(
    @Body() loginDto: LoginDto,
    @Request() req,
  ): Promise<LoginResponse> {
    return this.loginUseCase.execute(req.user);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Initiate password reset' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password reset email sent.',
  })
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<response> {
    await this.forgotPasswordUseCase.execute(forgotPasswordDto);

    return {
      status: true,
      message: 'Email successfully sent',
    };
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset user password' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password successfully reset.',
  })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<response> {
    const response = await this.resetPasswordUseCase.execute(resetPasswordDto);
    return {
      status: true,
      message: 'Password successfully reset',
      ...response,
    };
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async googleAuth(@Req() req) {
    console.log('req.user from google brfore the callback hook', req.user);
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    if (req.user) {
      console.log('User:', req.user);
    } else {
      console.error('User object is missing');
    }
  }

  @Get('linkedin')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinAuth(@Req() req) {
    console.log(req);
  }

  @Get('linkedin/callback')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinAuthRedirect(@Req() req) {
    console.log(req);
  }
}
