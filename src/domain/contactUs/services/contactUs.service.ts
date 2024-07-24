import { Inject, Injectable, Logger } from '@nestjs/common';
import { ContactUs } from '../entities';
import { ContactUsDto } from 'src/application/contactUs';
import { ContactUsRepository } from '../interfaces';

@Injectable()
export class ContactUsService {
  constructor(
    @Inject(ContactUsRepository)
    private readonly contactUsRepository: ContactUsRepository,
    private readonly logger: Logger,
  ) {}

  public async createContact(contact: ContactUsDto): Promise<ContactUs> {
    try {
      return await this.contactUsRepository.create(contact);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
