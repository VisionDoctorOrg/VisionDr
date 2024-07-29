import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserExistException } from 'src/common';
import { WaitlistRepository } from '../interfaces';
import {
  NewsLetterDto,
  WaitlistDto,
} from 'src/application/waitlist/dtos/waitlist.dto';
import { Newsletter, Waitlist } from '../entities';
import { MailService } from 'src/common/mail/mail.service';

@Injectable()
export class WaitlistService {
  private readonly logger = new Logger(WaitlistService.name);
  constructor(
    @Inject(WaitlistRepository)
    private readonly waitlistRepository: WaitlistRepository,
    private readonly mailService: MailService,
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

  public async newsLetter(newsletter: NewsLetterDto): Promise<any> {
    try {
      const { email } = newsletter;

      // Create a new contact or update existing contact

      const response = await this.mailService.newsLetter(email);
      //const response = await this.brevoApi.createContact(contact);

      this.logger.log('Subscription successful', response);
      return 'Subscription successful';
    } catch (error) {
      this.logger.error('Error subscribing to newsletter:', error);
      throw error;
    }
  }
}
