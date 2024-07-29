import { Injectable } from '@nestjs/common';
import { NewsLetterDto, WaitlistDto } from '../dtos/waitlist.dto';
import { Newsletter, Waitlist } from 'src/domain/waitlist/entities';
import { WaitlistMapper } from '../mappers/waitlist.mapper';
import { WaitlistService } from 'src/domain/waitlist/services/waitlist.service';

@Injectable()
export class WaitlistUseCase {
  constructor(private readonly waitlistService: WaitlistService) {}

  async execute(waitlistDto: WaitlistDto): Promise<Waitlist> {
    const waitlist = await this.waitlistService.createWaitlist(waitlistDto);
    return WaitlistMapper.toDto(waitlist);
  }

  async executeNewsLetter(newsLetterDto: NewsLetterDto): Promise<Newsletter> {
    const newsletter = await this.waitlistService.newsLetter(newsLetterDto);
    return WaitlistMapper.toNewsLetterDto(newsletter);
  }
}
