import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AuthProvider } from '@prisma/client';
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
    return await this.userRepository.create(user);
  }

  async updateUser(user: User): Promise<User> {
    return await this.userRepository.updateUser(user);
  }

  async updateUserProfile(
    id: string,
    updateUserDto: UpdateUserDto,
    file?: Express.Multer.File,
  ): Promise<User> {
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
  }

  async findUserById(userId: string): Promise<User | null> {
    const user = await this.userRepository.findById(userId);
    if (user) {
      return user;
    }
    return null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    if (user) {
      return user;
    }
    return null;
  }

  async findByProviderId(
    providerId: string,
    provider: AuthProvider,
  ): Promise<User | null> {
    const user = await this.userRepository.findByProviderId(
      providerId,
      provider,
    );
    if (user) {
      return user;
    }
    return null;
  }

  async findByResetToken(token: string): Promise<User | null> {
    return this.userRepository.findByResetToken(token);
  }
}
