import { Prisma } from '@prisma/client';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common';
import { User } from 'src/domain/admin/entities/user.entity';
import { UserRepository } from 'src/domain/admin/interfaces/user-repository.interface';

@Injectable()
export class UserRepo implements UserRepository {
  constructor(private readonly repository: PrismaService) {}

  async create(user: User): Promise<User> {
    try {
      return this.repository.user.create({
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          password:user.password,
        }
      });
    } catch (error) {
      console.log(error)
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new HttpException(
          'An error occurred',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw error;
    }
  }

    async findById(id: string): Promise<User> {
    return this.repository.user.findUnique({ where:{id} });
  }


  async findByEmail(email: string): Promise<User> {
    return this.repository.user.findUnique({ where:{email} });
  }


  async findByEmailOrPhone(email: string, phone: string): Promise<User | null> {
    return await this.repository.user.findFirst({
      where: {
        OR: [
          { email },
          { phone },
        ],
      },
    });
  } 
}
