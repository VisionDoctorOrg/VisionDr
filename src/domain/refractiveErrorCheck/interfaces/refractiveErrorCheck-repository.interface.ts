import { IRepository } from 'src/common';
import { RefractiveErrorCheck } from '../entities';
export const RefractiveErrorCheckRepository = Symbol(
  'RefractiveErrorCheckRepository',
);

export interface RefractiveErrorCheckRepository
  extends IRepository<RefractiveErrorCheck> {
  findRefractiveErrorCheckByUserId(
    userId: string,
  ): Promise<RefractiveErrorCheck | null>;
}
