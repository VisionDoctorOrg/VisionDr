import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { AuthMapper } from 'src/application/auth/mappers/auth.mapper';
import { SignupDto } from 'src/application/auth/dtos/signup.dto';
import { JwtAuthService, UserExistException } from 'src/common';
import { LoginDto } from 'src/application/auth/dtos/login.dto';
import { Prisma } from '@prisma/client';
import { User } from 'src/domain/admin/entities/user.entity';
import { UserRepository } from 'src/domain/admin/interfaces/user-repository.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository,
    private readonly jwtService: JwtAuthService,
  ) {}

  async signup(signupDto: SignupDto): Promise<User> {
  try {
    const userDomain = AuthMapper.toDomain(signupDto);
    userDomain.password = await hash(userDomain.password, 10); 

    const existingUser = await this.userRepository.findByEmailOrPhone(userDomain.email, userDomain.phone);
    if (existingUser) {
      throw new UserExistException('User')
    }

    const user = await this.userRepository.create(userDomain);
    return user;
  } catch (error) {
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

  async login(loginDto: LoginDto): Promise<{ user: User, accessToken: string }> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }
    const accessToken = this.jwtService.generateAuthToken(user.id, user.email);
    return { user, accessToken };
  }
}
