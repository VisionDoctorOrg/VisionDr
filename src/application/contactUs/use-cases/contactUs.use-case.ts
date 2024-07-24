import { Injectable } from '@nestjs/common';
import { ContactUsMapper } from '../mappers';
import { ContactUs } from 'src/domain/contactUs/entities';
import { ContactUsDto } from '../dtos';
import { ContactUsService } from 'src/domain/contactUs/services';

@Injectable()
export class ContactUsUseCase {
  constructor(private readonly contactUsService: ContactUsService) {}

  async execute(contactUsDto: ContactUsDto): Promise<ContactUs> {
    const contact = await this.contactUsService.createContact(contactUsDto);
    return ContactUsMapper.toDto(contact);
  }
}
