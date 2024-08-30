import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/common';
import { GlaucomaRepository } from 'src/domain/Questionnaire';
import { Glaucoma } from 'src/domain/Questionnaire/entities';

@Injectable()
export class glaucomaRepository implements GlaucomaRepository {
  private logger = new Logger('refractiveErrorCheckRepository');
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any): Promise<Glaucoma> {
    try {
      return await this.prisma.glaucoma.create({
        data: {
          eyeHealthHistory: data.eyeHealthHistory,
          visionSymptoms: data.visionSymptoms,
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
      console.error('Error creating glaucoma:', error);
      throw error;
    }
  }

  async findGlaucomaByUserId(userId: string): Promise<Glaucoma | null> {
    return await this.prisma.glaucoma.findUnique({
      where: { userId },
    });
  }
}
