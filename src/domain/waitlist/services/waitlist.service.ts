import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserExistException } from 'src/common';
import { WaitlistRepository } from '../interfaces';
import { WaitlistDto } from 'src/application/waitlist/dtos/waitlist.dto';
import { Waitlist } from '../entities';

@Injectable()
export class WaitlistService {
  constructor(
    @Inject(WaitlistRepository)
    private readonly waitlistRepository: WaitlistRepository,
    private readonly logger: Logger,
  ) {}

  public async createWaitlist(waitlist: WaitlistDto): Promise<Waitlist> {
    try {
      const existingUser = await this.waitlistRepository.findByEmailOrPhone(
        waitlist.email,
        waitlist.phone,
      );
      if (existingUser) {
        throw new UserExistException('User');
      }

      return await this.waitlistRepository.create(waitlist);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
