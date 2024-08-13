import { BaseUser } from 'src/common';

export class User extends BaseUser {
  googleId?: string;
  linkedinId?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  confirmPassword?: string;
}
