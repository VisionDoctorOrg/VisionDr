import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { hash, compare } from 'bcryptjs';
import { AuthMapper } from 'src/application/auth/mappers/auth.mapper';
import { SignupDto } from 'src/application/auth/dtos/signup.dto';
import { JwtAuthService, UserExistException } from 'src/common';
import { Prisma } from '@prisma/client';
import { User } from 'src/domain/users/entities/user.entity';
import { UserRepository } from 'src/domain/users/interfaces/user-repository.interface';
import { ResetPasswordDto } from 'src/application/auth/dtos/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository,
    private readonly jwtService: JwtAuthService,
  ) {}

  async signup(signupDto: SignupDto): Promise<User> {
    try {
      const userDomain = AuthMapper.toDomain(signupDto);

      if (userDomain.password !== userDomain.confirmPassword) {
        throw new HttpException(
          'Passwords do not match',
          HttpStatus.BAD_REQUEST,
        );
      }

      userDomain.password = await hash(userDomain.password, 10);

      const existingUser = await this.userRepository.findByEmail(
        userDomain.email,
      );
      if (existingUser) {
        throw new UserExistException('User');
      }

      const user = await this.userRepository.create(userDomain);
      return user;
    } catch (error) {
      console.log(error);
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new HttpException(
          'An error occurred, please check your values',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw error;
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    if (user && (await compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  async login(email: string): Promise<{ user: User; accessToken: string }> {
    const user = await this.findByEmail(email);
    const accessToken = this.jwtService.generateAuthToken(user.id, user.email);
    return { user, accessToken };
  }

  async forgotPassword(user: User): Promise<User> {
    return await this.userRepository.updateUser(user);
  }

  public async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<User> {
    // Find the user by the reset token
    const user = await this.userRepository.findByResetToken(
      resetPasswordDto.token,
    );

    // Check if the token is valid and not expired
    if (!user || user.resetPasswordExpires < new Date()) {
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Check if new password and confirm password match
    if (resetPasswordDto.newPassword !== resetPasswordDto.confirmPassword) {
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    }

    // Hash the new password and reset the token fields
    user.password = await hash(resetPasswordDto.newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    // Save the updated user
    return await this.userRepository.updateUser(user);
  }
}
