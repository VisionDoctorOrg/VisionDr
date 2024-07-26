import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly mailer: MailerService,
    private readonly configService: ConfigService,
  ) {}

  public async sendMail(
    to: string,
    subject: string,
    template: string,
    data: any = {},
  ) {
    this.logger.log('sending email...');

    try {
      const realTemplate = path.resolve(
        __dirname,
        'templates',
        ...template.split('.'),
      );

      return await this.mailer.sendMail({
        to,
        subject,
        template: realTemplate,
        context: {
          frontUrl: this.configService.get('FRONT_URL'),
          ...data,
        },
      });
    } catch (e) {
      this.logger.warn('Error while sending mail.', e);
    }
  }
}
