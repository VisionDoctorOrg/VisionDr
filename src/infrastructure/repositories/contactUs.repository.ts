import { Injectable } from '@nestjs/common';
import { ContactUsDto } from 'src/application/contactUs';
import { PrismaService } from 'src/common';
import { ContactUs } from 'src/domain/contactUs/entities';
import { ContactUsRepository } from 'src/domain/contactUs/interfaces';

@Injectable()
export class contactRepository implements ContactUsRepository {
  constructor(private readonly repository: PrismaService) {}

  public async create(contact: ContactUsDto): Promise<ContactUs> {
    return await this.repository.contactUs.create({
      data: {
        name: contact.fullName,
        message: contact.message,
        phone: contact.phone,
        email: contact.email,
        type: contact.type,
      },
    });
  }
}
