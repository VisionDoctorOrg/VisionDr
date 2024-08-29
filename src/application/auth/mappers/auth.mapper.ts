import { User } from 'src/domain/users/entities/user.entity';
import { SignupDto } from '../dtos/signup.dto';
import { Type } from 'src/common';
import { LoginResponse } from '../interface/response-interface';

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
        authProvider: user.authProvider,
        createdAt: user.createdAt,
      };
    }
    return {
      id: user.id,
      fullName: user.fullName,
      organizationName: user.organizationName,
      authProvider: user.authProvider,
      email: user.email,
      createdAt: user.createdAt,
      image: user.image,
      refractiveErrorCheck: user.refractiveErrorCheck,
    };
  }

  static toLoginDto(user: User, accessToken: string): LoginResponse {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt,
      accessToken,
      image: user.image,
      refractiveErrorCheck: user.refractiveErrorCheck,
    };
  }
}
