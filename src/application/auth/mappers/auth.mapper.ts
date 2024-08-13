import { User } from 'src/domain/users/entities/user.entity';
import { SignupDto } from '../dtos/signup.dto';
import { Type } from 'src/common';
import { LoginResponse } from '../interface/response-interface';

export class AuthMapper {
  static toDomain(signupDto: SignupDto): User {
    return {
      fullName: signupDto.fullName,
      organizationName: signupDto.organizationName,
      email: signupDto.email,
      password: signupDto.password,
      type: signupDto.type,
    };
  }

  static toDto(user: User): User {
    if (user.type === Type.Individual) {
      return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        createdAt: user.createdAt,
      };
    }
    return {
      id: user.id,
      fullName: user.fullName,
      organizationName: user.organizationName,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  static toLoginDto(user: User, accessToken: string): LoginResponse {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt,
      accessToken,
    };
  }
}
