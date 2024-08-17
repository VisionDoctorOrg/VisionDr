import { AuthProvider } from '@prisma/client';

export interface IRepository<T> {
  create(
    data: T,
    id?: string,
    i?: string,
    authProvider?: AuthProvider,
  ): Promise<T>;
  //findById(id: string): Promise<T | null>;
}
