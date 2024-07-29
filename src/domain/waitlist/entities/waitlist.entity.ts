import { BaseEntity } from 'src/common';

export class Waitlist extends BaseEntity {
  type?: string;
  organizationName?: string;
}

export class Newsletter extends BaseEntity {}
