import { Injectable } from '@nestjs/common';
import { WaitlistDto } from 'src/application/waitlist/dtos/waitlist.dto';
import { PrismaService } from 'src/common';
import { Waitlist } from 'src/domain/waitlist/entities';
import { WaitlistRepository } from 'src/domain/waitlist/interfaces';

@Injectable()
export class waitlistRepository implements WaitlistRepository {
  constructor(private readonly repository: PrismaService) {}

  public async create(waitlist: WaitlistDto): Promise<Waitlist> {
    return await this.repository.waitlist.create({
      data: {
        fullName: waitlist.fullName,
        organizationName: waitlist.organizationName,
        phone: waitlist.phone,
        email: waitlist.email,
        type: waitlist.type,
      },
    });
  }

  public async findByEmailOrPhone(
    email: string,
    phone: string,
  ): Promise<Waitlist | null> {
    return await this.repository.waitlist.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });
  }
}
