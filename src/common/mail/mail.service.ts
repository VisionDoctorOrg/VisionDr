import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor() {}

  async sendMail(
    to: string,
    subject: string,
    template: string,
    data: any = {},
  ) {
    this.logger.log('Adding email sending to queue...');
  }
}
