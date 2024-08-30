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
        data: {
          medicalHistory: data.medicalHistory,
          visionSymptoms: data.visionSymptoms,
          currentVisionCorrection: data.currentVisionCorrection,
          lifestyleVisualDemands: data.lifestyleVisualDemands,
          additionalInformation: data.additionalInformation,
          user: {
            connect: {
              id: data.userId,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error creating RefractiveErrorCheck:', error);
      throw error;
    }
  }

  async findRefractiveErrorCheckByUserId(
    userId: string,
  ): Promise<RefractiveErrorCheck | null> {
    return await this.prisma.refractiveErrorCheck.findUnique({
      where: { userId },
    });
  }
}
