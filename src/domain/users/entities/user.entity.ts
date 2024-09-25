import {
  AuthProvider,
  BloodPressure,
  Image,
  MedicationReminder,
  RefractiveErrorCheck,
  Subscription,
  VisionLevel,
} from '@prisma/client';
import { BaseUser } from 'src/common';
//import { Subscription } from 'src/domain/subscription/entities';

export class User extends BaseUser {
  googleId?: string;
  picture?: string;
  authProvider?: AuthProvider;
  linkedinId?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  confirmPassword?: string;
  phoneNumber?: string;
  DOB?: string;
  gender?: string;
  occupation?: string;
  hobbies?: string;
  imageId?: string;
  image?: Image;
  subscriptions?: Subscription[];
  accessToken?: string;
  refractiveErrorCheck?: RefractiveErrorCheck;
  bloodPressure?: BloodPressure;
  visionLevel?: VisionLevel;
  medicationReminder?: any;
}
