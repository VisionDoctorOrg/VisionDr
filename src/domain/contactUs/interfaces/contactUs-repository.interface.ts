import { ContactUs } from '../entities';
import { IRepository } from 'src/common';
export const ContactUsRepository = Symbol('ContactUsRepository');

export interface ContactUsRepository extends IRepository<ContactUs> {}
