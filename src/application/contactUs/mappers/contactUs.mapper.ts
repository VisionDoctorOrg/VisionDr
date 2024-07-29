import { ContactUsDto } from '../dtos';
import { ContactUs } from 'src/domain/contactUs/entities';

export class ContactUsMapper {
  static toDomain(contactUs: ContactUsDto): ContactUs {
    console.log(contactUs);
    return {
      fullName: contactUs.fullName,
      email: contactUs.email,
      phone: contactUs.phone,
      message: contactUs.message,
      type: contactUs.type,
    };
  }

  static toDto(contactUs: ContactUs): ContactUs {
    return {
      id: contactUs.id,
      fullName: contactUs.fullName,
      email: contactUs.email,
      phone: contactUs.phone,
      type: contactUs.type,
      message: contactUs.message,
      createdAt: contactUs.createdAt,
      updatedAt: contactUs.updatedAt,
    };
  }
}
