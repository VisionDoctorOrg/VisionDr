import { AuthProvider, Prisma } from '@prisma/client';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/common';
import { User } from 'src/domain/users/entities/user.entity';
import { UserRepository } from 'src/domain/users/interfaces/user-repository.interface';

@Injectable()
export class userRepository implements UserRepository {
  private logger = new Logger('userRepository');
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User): Promise<User> {
    try {
      const data: any = {
        fullName: user.fullName,
        email: user.email,
        authProvider: user.authProvider,
        organizationName: user.organizationName
          ? user.organizationName
          : undefined,
      };
      this.logger.verbose('AuthProvider:', data);
      if (user.authProvider.toUpperCase() === AuthProvider.EMAIL) {
        data.password = user.password;
        data.authProvider = AuthProvider.EMAIL;
        data.type = user.type;
      } else if (user.authProvider.toUpperCase() === AuthProvider.GOOGLE) {
        data.googleId = user.googleId;
        data.authProvider = AuthProvider.GOOGLE;
      } else if (user.authProvider.toUpperCase() === AuthProvider.LINKEDIN) {
        data.linkedinId = user.linkedinId;
        data.authProvider = AuthProvider.LINKEDIN;
      }

      this.logger.verbose('User to be created:', data);
      return await this.prisma.user.create({ data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new HttpException('Email already exists', HttpStatus.CONFLICT);
        }
      } else if (error instanceof Prisma.PrismaClientValidationError) {
        throw new HttpException('Validation error', HttpStatus.BAD_REQUEST);
      }
      throw error;
    }
  }

  async updateUser(userData: User): Promise<User> {
    try {
      const {
        email,
        DOB,
        gender,
        occupation,
        hobbies,
        imageId,
        phoneNumber,
        fullName,
      } = userData;
      const user = await this.findByEmail(email);
      this.logger.warn('User to be updated:', userData);
      if (user) {
        return await this.prisma.user.update({
          where: { id: user.id },
          data: {
            password: user.password,
            resetPasswordToken: user?.resetPasswordToken,
            resetPasswordExpires: user?.resetPasswordExpires,
            linkedinId: user?.linkedinId,
            googleId: user?.googleId,
            email: user.email,
            fullName,
            DOB,
            gender,
            occupation,
            hobbies,
            phoneNumber,
            imageId,
          },
          include: { image: true },
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async findByResetToken(token: string): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: { resetPasswordToken: token },
    });
  }

  // Find user by Google or LinkedIn ID
  async findByProviderId(
    providerId: string,
    provider: AuthProvider,
  ): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: {
        OR: [
          { googleId: provider === 'GOOGLE' ? providerId : undefined },
          { linkedinId: provider === 'LINKEDIN' ? providerId : undefined },
        ],
      },
    });
  }
}
