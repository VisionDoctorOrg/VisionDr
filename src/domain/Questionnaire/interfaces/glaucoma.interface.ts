import { IRepository } from 'src/common';
import { Glaucoma } from '../entities';
export const GlaucomaRepository = Symbol('RefractiveErrorCheckRepository');

export interface GlaucomaRepository extends IRepository<Glaucoma> {
  findGlaucomaByUserId(userId: string): Promise<Glaucoma | null>;
}
