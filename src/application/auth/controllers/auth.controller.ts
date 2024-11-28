import {
  Controller,
  Post,
  Body,
  HttpStatus,
  UseGuards,
  Get,
  Req,
  Request,
  Res,
  Query,
} from '@nestjs/common';
import { SignupDto } from '../dtos/signup.dto';
import { LoginDto } from '../dtos/login.dto';
import { SignupUseCase } from '../use-cases/signup.use-case';
import { LoginUseCase } from '../use-cases/login.use-case';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  GoogleOauthGuard,
  JwtAuthGuard,
  LocalAuthGuard,
} from 'src/domain/auth/guards';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { ForgotPasswordUseCase } from '../use-cases/forgot-password.use-case';
import { ResetPasswordUseCase } from '../use-cases/reset-password.use-case';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser, response } from 'src/common';
import { User } from 'src/domain/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly signupUseCase: SignupUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly configService: ConfigService,
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
      message: 'Please check your email to activate your account',
      data: { ...user },
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
  async login(@Body() loginDto: LoginDto, @Request() req): Promise<response> {
    const response = await this.loginUseCase.execute(req.user);

    return {
      status: true,
      message: 'Login successfully',
      data: { ...response },
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Current user details fetched successfully.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  async getCurrentUser(@CurrentUser() user: User): Promise<response> {
    return {
      status: true,
      message: 'Current user fetched successfully',
      data: user,
    };
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
      data: {},
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

  @Post('activate')
  @ApiOperation({ summary: 'Activate a new user account' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User account activated successfully.',
  })
  async activateAccount(
    @Query('Activation Token') token: string,
  ): Promise<response> {
    const user = await this.signupUseCase.executeVerification(token);
    return {
      status: true,
      message: 'Account activated successfully. You can now login.',
      data: {
        type: user.type,
        isOrganization: !!user.organizationName,
      },
    };
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async googleAuth(@Req() req) {
    console.log('req.user from google before the callback hook', req.user);
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    if (req.user) {
      const response = await this.loginUseCase.execute(req.user);
      const appToken = response.accessToken;

      // res.cookie('accessToken', appToken, {
      //   httpOnly: true,
      //   secure: true,
      //   sameSite: 'Strict',
      // });
      res.redirect(
        `${this.configService.get<string>('FRONT_URL')}/app/dashboard?token=${appToken}`,
      );
    } else {
      return res.redirect('/login');
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
