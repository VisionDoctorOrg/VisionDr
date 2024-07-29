// import { MailerService } from '@nestjs-modules/mailer';
// import { Injectable, Logger } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import * as path from 'path';
// @Injectable()
// export class MailService {
//   private readonly logger = new Logger(MailService.name);

//   constructor(
//     private readonly mailer: MailerService,
//     private readonly configService: ConfigService,
//   ) {}

//   public async sendMail(
//     to: string,
//     subject: string,
//     template: string,
//     data: any = {},
//   ) {
//     this.logger.log('sending email...');

//     try {
//       const realTemplate = path.resolve(
//         __dirname,
//         'templates',
//         ...template.split('.'),
//       );

//       return await this.mailer.sendMail({
//         to,
//         subject,
//         template: realTemplate,
//         context: {
//           frontUrl: this.configService.get('FRONT_URL'),
//           ...data,
//         },
//       });
//     } catch (e) {
//       this.logger.warn('Error while sending mail.', e);
//     }
//   }
// }

// mail.service.ts
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as SibApiV3Sdk from 'sib-api-v3-sdk';

// @Injectable()
// export class MailService {
//   private readonly logger = new Logger(MailService.name);
//   private readonly brevoApiKey: string;
//   private readonly brevoApi: any;

//   constructor(
//     private readonly mailer: MailerService,
//     private readonly configService: ConfigService,
//   ) {
//     this.brevoApiKey = this.configService.get<string>('BREVO_API_KEY');
//     SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey =
//       this.brevoApiKey;
//     this.brevoApi = new SibApiV3Sdk.TransactionalEmailsApi();
//   }

//   public async sendMail(
//     to: string,
//     subject: string,
//     template: string,
//     data: any = {},
//   ) {
//     this.logger.log('sending email...');

//     try {
//       const realTemplate = path.resolve(
//         __dirname,
//         'templates',
//         ...template.split('.'),
//       );

//       const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
//       sendSmtpEmail.subject = subject;
//       sendSmtpEmail.htmlContent = `<p>${realTemplate}</p>`;
//       sendSmtpEmail.sender = {
//         name: 'VisionDr',
//         email: 'ignatiuzzfrank@279241690.t-sender-sib.com',
//       };
//       sendSmtpEmail.to = [{ email: to, name: data.name || 'User' }];
//       sendSmtpEmail.params = {
//         frontUrl: this.configService.get('FRONT_URL'),
//         ...data,
//       };

//       const response = await this.brevoApi.sendTransacEmail(sendSmtpEmail);
//       this.logger.log(
//         'Email sent successfully. Response: ' + JSON.stringify(response),
//       );
//       return response;
//     } catch (e) {
//       this.logger.warn('Error while sending mail.', e);
//       throw new Error('Failed to send email');
//     }
//   }
// }

import * as fs from 'fs';
import * as handlebars from 'handlebars';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly brevoApiKey: string;
  private readonly brevoApi: SibApiV3Sdk.TransactionalEmailsApi;
  private readonly brevoApii: SibApiV3Sdk.createContact;

  constructor(
    //private readonly mailer: MailerService,
    private readonly configService: ConfigService,
  ) {
    this.brevoApiKey = this.configService.get<string>('BREVO_API_KEY');
    SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey =
      this.brevoApiKey;
    this.brevoApi = new SibApiV3Sdk.TransactionalEmailsApi();
    this.brevoApii = new SibApiV3Sdk.ContactsApi();
  }

  public async sendMail(
    to: string,
    subject: string,
    template: string,
    data: any = {},
  ) {
    this.logger.log('Sending email...');

    try {
      const templatePath = path.resolve(
        __dirname,
        'templates',
        `${template}.hbs`,
      );
      this.logger.log(`Template Path: ${templatePath}`);

      // Manually read and compile the template
      const templateContent = fs.readFileSync(templatePath, 'utf-8');
      const compiledTemplate = handlebars.compile(templateContent);
      const emailHtml = compiledTemplate({
        frontUrl: this.configService.get('FRONT_URL'),
        ...data,
      });

      if (!emailHtml) {
        throw new Error('Rendered email content is empty.');
      }

      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
      sendSmtpEmail.subject = subject;
      sendSmtpEmail.htmlContent = emailHtml;
      sendSmtpEmail.sender = {
        name: 'VisionDr',
        email: 'ignatiuzzfrank@gmail.com',
      };
      sendSmtpEmail.to = [{ email: to, name: data.name || 'User' }];
      sendSmtpEmail.params = {
        frontUrl: this.configService.get('FRONT_URL'),
        ...data,
      };

      this.logger.log('Sending Email Payload:', JSON.stringify(sendSmtpEmail));

      const response = await this.brevoApi.sendTransacEmail(sendSmtpEmail);

      this.logger.log('Brevo Response:', JSON.stringify(response));
      this.logger.log(
        'Email sent successfully. Response: ' + JSON.stringify(response),
      );
      return response;
    } catch (e) {
      this.logger.error('Error while sending mail.', e.stack);
      throw new Error('Failed to send email');
    }
  }

  public async newsLetter(email: string): Promise<any> {
    try {
      const contact = {
        email,
        listIds: [3],
      };

      const response = await this.brevoApii.createContact(contact);

      this.logger.log('Subscription successful:', response);
      return response;
    } catch (error) {
      this.logger.error('Error subscribing to newsletter:', error);
      throw error;
    }
  }
}
