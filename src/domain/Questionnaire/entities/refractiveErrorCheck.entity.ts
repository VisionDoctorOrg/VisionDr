import { User } from '@prisma/client';

export class RefractiveErrorCheck {
  id?: string;
  userId?: string;
  user?: User;
  medicalHistory: any;
  visionSymptoms: any;
  currentVisionCorrection: any;
  lifestyleVisualDemands: any;
  additionalInformation: any;
  createdAt?: Date;
  updatedAt?: Date;
}
