import { IRepository } from 'src/common';
import { CaseFile } from '../entities';
export const CaseFileRepository = Symbol('RefractiveErrorCheckRepository');

export interface CaseFileRepository extends IRepository<CaseFile> {
  findCaseFileByUserId(userId: string): Promise<CaseFile | null>;
}
