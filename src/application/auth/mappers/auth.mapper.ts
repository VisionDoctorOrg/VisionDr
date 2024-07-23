import { User } from 'src/domain/users/entities/user.entity';
import { SignupDto } from '../dtos/signup.dto';

export class AuthMapper {
  static toDomain(signupDto: SignupDto): User {
    return {
      firstName: signupDto.firstName,
      lastName: signupDto.lastName,
      email: signupDto.email,
      phone: signupDto.phone,
      password: signupDto.password,
    };
  }

  static toDto(user: User): User {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
