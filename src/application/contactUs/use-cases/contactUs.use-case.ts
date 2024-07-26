import { Injectable } from '@nestjs/common';
import { ContactUsMapper } from '../mappers';
import { ContactUs } from 'src/domain/contactUs/entities';
import { ContactUsDto } from '../dtos';
import { ContactUsService } from 'src/domain/contactUs/services';
import { MailService } from 'src/common/mail/mail.service';

@Injectable()
export class ContactUsUseCase {
  constructor(
    private readonly contactUsService: ContactUsService,
    private readonly mailService: MailService,
  ) {}

  async execute(contactUsDto: ContactUsDto): Promise<ContactUs> {
    const contact = await this.contactUsService.createContact(contactUsDto);

    // send mail
    await this.mailService.sendMail(
      'ignatiuzzfrank@gmail.com',
      'Contact Request',
      'contact',
      {
        firstName: contact.fullName,
        phone: contact.phone,
        message: contact.message,
        type: contact.type,
      },
    );

    return ContactUsMapper.toDto(contact);
  }
}
