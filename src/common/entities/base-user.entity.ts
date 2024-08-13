import { Type } from '@prisma/client';

export abstract class BaseUser {
  id?: string;
  fullName?: string;
  organizationName?: string;
  type?: Type;
  email: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
