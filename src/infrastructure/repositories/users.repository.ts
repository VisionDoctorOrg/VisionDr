import { AuthProvider, Prisma } from '@prisma/client';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common';
import { User } from 'src/domain/users/entities/user.entity';
import { UserRepository } from 'src/domain/users/interfaces/user-repository.interface';

@Injectable()
export class UserRepo implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Handle regular user creation (email/password)
  async create(user: User): Promise<User> {
    try {
      return this.prisma.user.create({
        data: {
          fullName: user.fullName,
          organizationName: user.organizationName
            ? user.organizationName
            : undefined,
          email: user.email,
          password: user.password,
          type: user.type,
          authProvider: AuthProvider.EMAIL,
          // googleId: user.googleId ? user.googleId : undefined,
          // linkedinId: user.linkedinId ? user.linkedinId : undefined,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new HttpException(
            'Email or phone already exists',
            HttpStatus.CONFLICT,
          );
        }
      } else if (error instanceof Prisma.PrismaClientValidationError) {
        throw new HttpException('Validation error', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'An unexpected error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Find user by ID
  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  // Find user by email
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  // Find user by Google or LinkedIn ID
  // async findByProviderId(
  //   providerId: string,
  //   provider: AuthProvider,
  // ): Promise<User | null> {
  //   return this.prisma.user.findFirst({
  //     where: {
  //       OR: [
  //         { googleId: provider === 'GOOGLE' ? providerId : undefined },
  //         { linkedinId: provider === 'LINKEDIN' ? providerId : undefined },
  //       ],
  //     },
  //   });
  // }

  // Create user with OAuth (Google/LinkedIn)
  async createOAuthUser(profile: any, provider: AuthProvider): Promise<User> {
    const data: any = {
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      authProvider: provider,
    };

    if (provider === 'GOOGLE') {
      data.googleId = profile.googleId;
    } else if (provider === 'LINKEDIN') {
      data.linkedinId = profile.linkedinId;
    }

    return this.prisma.user.create({ data });
  }
}
