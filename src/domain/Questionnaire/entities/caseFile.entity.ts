import { User } from '@prisma/client';

export class CaseFile {
  id?: string;
  userId?: string;
  user?: User;
  mainComplaint: any;
  eyeHistory: any;
  medicalHistory: any;
  lastEyeExamination: any;
  allergies: any;
  familyVisualHistory: any;
  familyMedicalHistory: any;
  currentDrugUse: any;
  createdAt?: Date;
  updatedAt?: Date;
}
