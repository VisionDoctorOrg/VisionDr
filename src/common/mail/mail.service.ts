// mail.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SibApiV3Sdk from 'sib-api-v3-sdk';
import * as handlebars from 'handlebars';

export interface ContactUsForm {
  id: string;
  name: string;
  type: 'Individual' | 'Organization';
  email: string;
  phone: string;
  message: string;
  createdAt: Date;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly brevoApiKey: string;
  private readonly brevoApi: SibApiV3Sdk.TransactionalEmailsApi;
  private readonly brevoApii: SibApiV3Sdk.createContact;

  constructor(private readonly configService: ConfigService) {
    this.brevoApiKey = this.configService.get<string>('BREVO_API_KEY');
    SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey =
      this.brevoApiKey;
    this.brevoApi = new SibApiV3Sdk.TransactionalEmailsApi();
    this.brevoApii = new SibApiV3Sdk.ContactsApi();
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

  private getTemplate(template: string): string {
    const templates = {
      contactUs: `
        <p>Admin,</p>
        <p>A user has submitted the contact form with the following details:</p>
        <p><strong>Name:</strong> {{firstName}}</p>
        <p><strong>Email:</strong> {{email}}</p>
        <p><strong>Phone:</strong> {{phone}}</p>
        <p><strong>Message:</strong> {{message}}</p>
        <p><strong>Type:</strong> {{type}}</p>
      `,
    };

    return templates[template] || '';
  }

  public async sendMail(adminEmail: string, data: any = {}) {
    this.logger.log('Sending contact us notification email...');

    try {
      // Get the template content
      const templateContent = this.getTemplate('contactUs');

      if (!templateContent) {
        throw new Error('Template contactUs not found.');
      }

      // Compile the template
      const compiledTemplate = handlebars.compile(templateContent);

      // Render the template with actual data
      const emailHtml = compiledTemplate({
        firstName: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        type: data.type,
      });

      if (!emailHtml) {
        throw new Error('Rendered email content is empty.');
      }

      console.log(emailHtml);

      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
      sendSmtpEmail.subject = 'New Contact Us Form Submission';
      sendSmtpEmail.htmlContent = emailHtml;
      sendSmtpEmail.sender = {
        name: 'VisionDR',
        email: 'ignatiuzzfrank@gmail.com',
      };
      sendSmtpEmail.to = [{ email: adminEmail, name: 'Admin' }];

      this.logger.log('Sending Email Payload:', JSON.stringify(sendSmtpEmail));

      const response = await this.brevoApi.sendTransacEmail(sendSmtpEmail);

      this.logger.log('Brevo Response:', JSON.stringify(response));
      this.logger.log(
        'Contact us notification email sent successfully. Response: ' +
          JSON.stringify(response),
      );
      return response;
    } catch (e) {
      this.logger.error(
        'Error while sending contact us notification email.',
        e.stack,
      );
      throw new Error('Failed to send contact us notification email');
    }
  }
}
