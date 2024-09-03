import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/common';
import { CaseFileRepository } from 'src/domain/Questionnaire';
import { CaseFile, Glaucoma } from 'src/domain/Questionnaire/entities';

@Injectable()
export class caseFileRepository implements CaseFileRepository {
  private logger = new Logger('refractiveErrorCheckRepository');
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any): Promise<CaseFile> {
    try {
      return await this.prisma.caseFile.create({
        data: {
          mainComplaint: data.mainComplaint,
          eyeHistory: data.eyeHistory,
          medicalHistory: data.medicalHistory,
          lastEyeExamination: data.lastEyeExamination,
          familyVisualHistory: data.familyVisualHistory,
          familyMedicalHistory: data.familyMedicalHistory,
          allergies: data.allergies,
          currentDrugUse: data.currentDrugUse,
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

  async findCaseFileByUserId(userId: string): Promise<CaseFile | null> {
    return await this.prisma.caseFile.findUnique({
      where: { userId },
    });
  }
}
