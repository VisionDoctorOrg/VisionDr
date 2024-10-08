import { User } from 'src/domain/users/entities/user.entity';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { AdditionalInformation } from '@prisma/client';

export class UsersMapper {
  static toDomain(updateUserDto: UpdateUserDto): UpdateUserDto {
    return {
      fullName: updateUserDto.fullName,
      DOB: updateUserDto.DOB,
      gender: updateUserDto.gender,
      occupation: updateUserDto.occupation,
      hobbies: updateUserDto.hobbies,
      email: updateUserDto.email,
    };
  }

  static toDto(user: User): User {
    return {
      id: user.id,
      fullName: user.fullName,
      DOB: user.DOB,
      gender: user.gender,
      hobbies: user.hobbies,
      occupation: user.occupation,
      phoneNumber: user.phoneNumber,
      email: user.email,
      authProvider: user.authProvider,
      createdAt: user.createdAt,
      image: user.image,
    };
  }

  static additionalInfoDto(info: AdditionalInformation): AdditionalInformation {
    return {
      id: info.id,
      currentVision: info.currentVision,
      lifeStyle: info.lifeStyle,
      createdAt: info.createdAt,
      updatedAt: info.updatedAt,
      userId: info.userId,
    };
  }
}
