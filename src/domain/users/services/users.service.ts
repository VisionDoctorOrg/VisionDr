import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AdditionalInformation, AuthProvider, Status } from '@prisma/client';
import { UpdateAdditionalInfoDto } from 'src/application/users/dtos/additional-info.dto';
import { UpdateUserDto } from 'src/application/users/dtos/update-user.dto';
import { CloudinaryService, PrismaService } from 'src/common';
import { User } from 'src/domain/users/entities/user.entity';
import { UserRepository } from 'src/domain/users/interfaces/user-repository.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository,
    private readonly prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(user: User): Promise<User> {
    try {
      return await this.userRepository.create(user);
    } catch (error) {
      throw error;
    }
  }

  async updateUser(user: User): Promise<User> {
    try {
      return await this.userRepository.updateUser(user);
    } catch (error) {
      throw error;
    }
  }

  async updateUserProfile(
    id: string,
    updateUserDto: UpdateUserDto,
    file?: Express.Multer.File,
  ): Promise<User> {
    try {
      let user = await this.prismaService.user.findUnique({
        where: { id },
        include: { image: true },
      });

      if (!user) {
        throw new HttpException(
          `User with id number ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      // if (!Object.keys(UpdateUserDto).length) {
      //   // return {
      //   //   status: 'No Updates',
      //   //   data: [],
      //   // };
      //
      // }

      let image = null;
      if (file) {
        if (user.image) {
          await this.cloudinaryService.deleteResource(user.image.publicId);
        }

        const imagesLink = await this.cloudinaryService
          .uploadImage(file)
          .catch((error) => {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
          });

        if (user.image) {
          image = await this.prismaService.image.update({
            where: { id: user.image.id },
            data: {
              publicId: imagesLink?.public_id,
              url: imagesLink?.url,
            },
          });
        } else {
          image = await this.prismaService.image.create({
            data: {
              publicId: imagesLink?.public_id,
              url: imagesLink?.url,
            },
          });
        }
      }

      return await this.userRepository.updateUser({
        ...updateUserDto,
        email: user.email,
        imageId: image?.id,
      });
    } catch (error) {
      throw error;
    }
  }

  async findUserById(userId: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findById(userId);
      if (user) {
        return user;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (user) {
        return user;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findByPhoneNumber(phoneNumber);
      if (user) {
        return user;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  async findByProviderId(
    providerId: string,
    provider: AuthProvider,
  ): Promise<User | null> {
    try {
      const user = await this.userRepository.findByProviderId(
        providerId,
        provider,
      );
      if (user) {
        return user;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  async findByResetToken(token: string): Promise<User | null> {
    try {
      return this.userRepository.findByResetToken(token);
    } catch (error) {
      throw error;
    }
  }

  async findByEmailOrPhone(
    email?: string,
    phoneNumber?: string,
  ): Promise<User | null> {
    try {
      const user = await this.userRepository.findByEmailOrPhone(
        email,
        phoneNumber,
      );
      if (user) {
        return user;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  async updateUserSubscriptionStatus(
    id: string,
    status: Status,
  ): Promise<void> {
    try {
      await this.prismaService.user.update({
        where: { id },
        data: { subscriptionActive: status },
      });
    } catch (error) {
      throw error;
    }
  }

  async createAdditionalInfo(
    userId: string,
    updateAdditionalInfoDto: UpdateAdditionalInfoDto,
  ): Promise<AdditionalInformation> {
    return this.userRepository.createAdditionalInfo(
      userId,
      updateAdditionalInfoDto,
    );
  }

  async getAdditionalInfo(
    userId: string,
  ): Promise<AdditionalInformation | null> {
    try {
      const info = await this.userRepository.getAdditionalInfo(userId);
      if (info) {
        return info;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  async updateAdditionalInformation(
    id: string,
    UpdateAdditionalInfoDto: UpdateAdditionalInfoDto,
  ): Promise<AdditionalInformation> {
    try {
      return await this.userRepository.updateAdditionalInformation(
        id,
        UpdateAdditionalInfoDto,
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
