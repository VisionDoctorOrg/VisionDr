import { BaseEntity } from 'src/common';

export class ContactUs extends BaseEntity {
  type?: string;
  message?: string;
  name?: string;
}
