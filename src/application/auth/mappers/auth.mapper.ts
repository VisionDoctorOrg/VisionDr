import { User } from 'src/domain/users/entities/user.entity';
import { SignupDto } from '../dtos/signup.dto';
import { Type } from 'src/common';

export class AuthMapper {
  static toDomain(signupDto: SignupDto): SignupDto {
    return {
      fullName: signupDto.fullName,
      organizationName: signupDto.organizationName,
      email: signupDto.email,
      password: signupDto.password,
      confirmPassword: signupDto.confirmPassword,
      type: signupDto.type,
    };
  }

  static toDto(user: User): User {
    if (user.type === Type.Individual) {
      return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber:user.phoneNumber,
        authProvider: user.authProvider,
        subscriptions: user.subscriptions,
        refractiveErrorCheck: user.refractiveErrorCheck,
        image: user.image,
        createdAt: user.createdAt,
      };
    }
    return {
      id: user.id,
      fullName: user.fullName,
      organizationName: user.organizationName,
      authProvider: user.authProvider,
      phoneNumber:user.phoneNumber,
      email: user.email,
      createdAt: user.createdAt,
      image: user.image,
      subscriptions: user.subscriptions,
      refractiveErrorCheck: user.refractiveErrorCheck,
    };
  }

  static toLoginDto(user: User, accessToken: string): User {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber:user.phoneNumber,
      createdAt: user.createdAt,
      accessToken,
      image: user.image,
      subscriptions: user.subscriptions,
      refractiveErrorCheck: user.refractiveErrorCheck,
    };
  }
}
