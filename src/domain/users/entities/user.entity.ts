import { AuthProvider, Image, RefractiveErrorCheck } from '@prisma/client';
import { BaseUser } from 'src/common';

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
  refractiveErrorCheck?: RefractiveErrorCheck;
}
