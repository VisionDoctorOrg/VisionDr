// mail.service.ts
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
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

  // public async newsLetter(email: string, ): Promise<any> {
  //   try {
  //     console.log('ENV:', this.configService.get<string>('NODE_ENV'));
  //     const listId =
  //       this.configService.get<string>('NODE_ENV') === 'development'
  //         ? 3
  //         : Number(this.configService.get<string>('LISTID'));

  //     const contact = {
  //       email,
  //       listIds: [listId],
  //     };

  //     try {
  //       const response = await this.brevoApii.createContact(contact);
  //       this.logger.log('Subscription successful:', response);
  //       return response;
  //     } catch (createError) {
  //       if (createError?.response?.text) {
  //         const responseText = JSON.parse(createError.response.text);

  //         if (responseText.code === 'duplicate_parameter') {
  //           this.logger.log(`Contact already exists: ${email}`);

  //           const existingContact = await this.brevoApii.getContactInfo(email);

  //           // Check if the contact is already in the desired list
  //           if (existingContact.listIds.includes(listId)) {
  //             throw new HttpException(
  //               'Already subscribed',
  //               HttpStatus.CONFLICT,
  //             );
  //           }

  //           // Merge existing list IDs with the new list ID
  //           const updatedListIds = new Set([
  //             ...existingContact.listIds,
  //             listId,
  //           ]);

  //           const updateContact = {
  //             listIds: Array.from(updatedListIds),
  //           };

  //           // Update the contact with the new list memberships
  //           const updateResponse = await this.brevoApii.updateContact(
  //             email,
  //             updateContact,
  //           );
  //           this.logger.log(
  //             `Contact already exists and updated for list ${listId}`,
  //           );
  //           return updateResponse;
  //         }
  //       }
  //       this.logger.error('Error creating contact:', createError);
  //       throw createError;
  //     }
  //   } catch (error) {
  //     this.logger.error('Error subscribing to newsletter:', error.message);
  //     throw error;
  //   }
  // }

  public async subscribe(
    email: string,
    type: 'waitlist' | 'newsletter',
  ): Promise<any> {
    try {
      console.log('ENV:', this.configService.get<string>('NODE_ENV'));

      const listId =
        this.configService.get<string>('NODE_ENV') === 'development'
          ? type === 'waitlist'
            ? 6
            : 8
          : type === 'waitlist'
            ? Number(this.configService.get<string>('WAITLIST_ID'))
            : Number(this.configService.get<string>('NEWSLETTER_ID'));

      const contact = {
        email,
        listIds: [listId],
      };

      try {
        const response = await this.brevoApii.createContact(contact);
        this.logger.log('Subscription successful:', response);
        return response;
      } catch (createError) {
        if (createError?.response?.text) {
          const responseText = JSON.parse(createError.response.text);

          if (responseText.code === 'duplicate_parameter') {
            this.logger.log(`Contact already exists: ${email}`);

            // Fetch existing contact details
            const existingContact = await this.brevoApii.getContactInfo(email);

            // Check if the contact is already in the desired list
            if (existingContact.listIds.includes(listId)) {
              throw new HttpException(
                `Contact already exists in the ${type} list`,
                HttpStatus.CONFLICT,
              );
            }

            // Merge existing list IDs with the new list ID
            const updatedListIds = new Set([
              ...existingContact.listIds,
              listId,
            ]);

            const updateContact = {
              listIds: Array.from(updatedListIds),
            };

            // Update the contact with the new list memberships
            const updateResponse = await this.brevoApii.updateContact(
              email,
              updateContact,
            );
            this.logger.log(
              `Contact already exists and updated for ${type} list`,
            );
            return updateResponse;
          }
        }
        this.logger.error('Error creating contact:', createError);
        throw createError;
      }
    } catch (error) {
      this.logger.error(`Error subscribing to ${type}:`, error.message);
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
        name: this.configService.get<string>('SENDERNAME'),
        email: this.configService.get<string>('MAIL_FROM'),
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
    }
  }
}
