import {
  AdditionalInformation,
  AuthProvider,
  BloodPressure,
  Prisma,
  VisionLevel,
} from '@prisma/client';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/common';
import { User } from 'src/domain/users/entities/user.entity';
import { UserRepository } from 'src/domain/users/interfaces/user-repository.interface';
import { UpdateAdditionalInfoDto } from 'src/application/users/dtos/additional-info.dto';
import {
  CreateBloodPressureDto,
  CreateVisionDto,
} from 'src/application/users/dtos';

@Injectable()
export class userRepository implements UserRepository {
  private logger = new Logger('userRepository');
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User): Promise<User> {
    try {
      const data: any = {
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
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
          include: {
            image: true,
            subscriptions: true,
            refractiveErrorCheck: true,
          },
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async createAdditionalInfo(
    userId: string,
    dto: UpdateAdditionalInfoDto,
  ): Promise<AdditionalInformation> {
    try {
      const additionalInfo = await this.prisma.additionalInformation.create({
        data: {
          currentVision: dto.currentVision,
          lifeStyle: dto.lifeStyle,
          userId,
        },
      });

      return additionalInfo;
    } catch (error) {
      throw error;
    }
  }

  async getAdditionalInfo(
    userId: string,
  ): Promise<AdditionalInformation | null> {
    try {
      return await this.prisma.additionalInformation.findUnique({
        where: { userId },
        include: { user: true },
      });
    } catch (error) {
      throw error;
    }
  }

  async updateAdditionalInformation(
    id: string,
    info: UpdateAdditionalInfoDto,
  ): Promise<AdditionalInformation> {
    try {
      return await this.prisma.additionalInformation.update({
        where: { id },
        data: {
          currentVision: info.currentVision,
          lifeStyle: info?.lifeStyle,
        },
        include: {
          user: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id },
      include: { image: true, subscriptions: true, refractiveErrorCheck: true },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email },
      include: { image: true, subscriptions: true, refractiveErrorCheck: true },
    });
  }

  async findByEmailOrPhone(
    email?: string,
    phoneNumber?: string,
  ): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: email || undefined },
          { phoneNumber: phoneNumber || undefined },
        ],
      },
    });
  }

  async findByResetToken(token: string): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: { resetPasswordToken: token },
    });
  }

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

  async createBloodPressure(
    userId: string,
    dto: CreateBloodPressureDto,
  ): Promise<BloodPressure> {
    try {
      const bloodPressure = await this.prisma.bloodPressure.create({
        data: {
          systolic: dto.systolic,
          diastolic: dto.diastolic,
          userId,
        },
      });

      return bloodPressure;
    } catch (error) {
      throw error;
    }
  }

  async getBloodPressure(userId: string): Promise<BloodPressure | null> {
    try {
      return await this.prisma.bloodPressure.findUnique({
        where: { userId },
        include: { user: true },
      });
    } catch (error) {
      throw error;
    }
  }

  async updateBloodPressure(
    id: string,
    CreateBloodPressureDto: CreateBloodPressureDto,
  ): Promise<BloodPressure> {
    try {
      return await this.prisma.bloodPressure.update({
        where: { id },
        data: {
          systolic: CreateBloodPressureDto.systolic,
          diastolic: CreateBloodPressureDto?.diastolic,
        },
        include: {
          user: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getVisionLevel(userId: string): Promise<VisionLevel | null> {
    try {
      return await this.prisma.visionLevel.findUnique({
        where: { userId },
        include: { user: true },
      });
    } catch (error) {
      throw error;
    }
  }

  async createVisionLevel(
    userId: string,
    dto: CreateVisionDto,
  ): Promise<VisionLevel> {
    try {
      const vision = await this.prisma.visionLevel.create({
        data: {
          visionLevel: dto.visionLevel,
          userId,
        },
      });

      return vision;
    } catch (error) {
      throw error;
    }
  }

  async updateVisionLevel(
    id: string,
    updateVisionLevelDto: CreateVisionDto,
  ): Promise<VisionLevel> {
    try {
      return this.prisma.visionLevel.update({
        where: { id },
        data: { visionLevel: updateVisionLevelDto.visionLevel },
      });
    } catch (error) {
      return error;
    }
  }
}
