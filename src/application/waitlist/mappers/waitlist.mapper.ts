import { Newsletter, Waitlist } from 'src/domain/waitlist/entities';
import { NewsLetterDto, WaitlistDto } from '../dtos/waitlist.dto';
import { Type } from '@prisma/client';

export class WaitlistMapper {
  static toDomain(waitlist: WaitlistDto): Waitlist {
    return {
      fullName: waitlist.fullName,
      email: waitlist.email,
      phone: waitlist.phone,
      organizationName: waitlist.organizationName,
      type: waitlist.type,
    };
  }

  static toDto(waitlist: Waitlist): Waitlist {
    if (waitlist.type === Type.Individual) {
      return {
        id: waitlist.id,
        fullName: waitlist.fullName,
        email: waitlist.email,
        phone: waitlist.phone,
        createdAt: waitlist.createdAt,
        updatedAt: waitlist.updatedAt,
      };
    }
    return {
      id: waitlist.id,
      fullName: waitlist.fullName,
      organizationName: waitlist.organizationName,
      email: waitlist.email,
      phone: waitlist.phone,
      createdAt: waitlist.createdAt,
      updatedAt: waitlist.updatedAt,
    };
  }

  static toNewsLetterDomain(newsLetterDto: NewsLetterDto): Newsletter {
    return {
      email: newsLetterDto.email,
    };
  }

  static toNewsLetterDto(newsletter: Newsletter): Newsletter {
    return {
      id: newsletter.id,
      email: newsletter.email,
      createdAt: newsletter.createdAt,
      updatedAt: newsletter.updatedAt,
    };
  }
}
