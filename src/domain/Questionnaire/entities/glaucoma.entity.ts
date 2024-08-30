import { User } from '@prisma/client';

export class Glaucoma {
  id?: string;
  userId?: string;
  user?: User;
  eyeHealthHistory: any;
  visionSymptoms: any;
  lifestyleVisualDemands: any;
  additionalInformation: any;
  createdAt?: Date;
  updatedAt?: Date;
}
