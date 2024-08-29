import { Prisma } from '@prisma/client';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/common';
import { RefractiveErrorCheckRepository } from 'src/domain/refractiveErrorCheck';
import { RefractiveErrorCheck } from 'src/domain/refractiveErrorCheck/entities';

@Injectable()
export class refractiveErrorCheckRepository
  implements RefractiveErrorCheckRepository
{
  private logger = new Logger('refractiveErrorCheckRepository');
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any): Promise<RefractiveErrorCheck> {
    try {
      return await this.prisma.refractiveErrorCheck.create({
        data,
        include: { user: true },
      });
    } catch (error) {
      this.logger.error(error.message);
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new HttpException('Validation error', HttpStatus.BAD_REQUEST);
      }
      throw error;
    }
  }
}
