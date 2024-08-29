import { Image, RefractiveErrorCheck } from '@prisma/client';

export interface LoginResponse {
  id?: string;
  fullName?: string;
  organizationName?: string;
  email: string;
  createdAt?: Date;
  accessToken: string;
  image?: Image;
  refractiveErrorCheck?: RefractiveErrorCheck;
}

export interface response {
  status?: boolean;
  message?: string;
  id?: string;
  fullName?: string;
  organizationName?: string;
  email?: string;
  createdAt?: Date;
}
