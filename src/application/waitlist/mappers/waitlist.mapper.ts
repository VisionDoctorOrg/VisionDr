import { Waitlist } from 'src/domain/waitlist/entities';
import { WaitlistDto } from '../dtos/waitlist.dto';
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
}
