import { Injectable } from '@nestjs/common';
import { WaitlistDto } from '../dtos/waitlist.dto';
import { Waitlist } from 'src/domain/waitlist/entities';
import { WaitlistMapper } from '../mappers/waitlist.mapper';
import { WaitlistService } from 'src/domain/waitlist/services/waitlist.service';

@Injectable()
export class WaitlistUseCase {
  constructor(private readonly waitlistService: WaitlistService) {}

  async execute(waitlistDto: WaitlistDto): Promise<Waitlist> {
    const waitlist = await this.waitlistService.createWaitlist(waitlistDto);
    return WaitlistMapper.toDto(waitlist);
  }
}
