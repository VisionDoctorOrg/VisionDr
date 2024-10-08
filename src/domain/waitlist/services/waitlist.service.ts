import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { UserEmailExistException } from 'src/common';
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
      const existingUser = await this.waitlistRepository.findByEmail(
        waitlist.email,
      );
      if (existingUser) {
        throw new UserEmailExistException('User');
      }

      await this.mailService.subscribe(waitlist.email, 'waitlist');

      return await this.waitlistRepository.create(waitlist);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  public async newsLetter(newsletter: NewsLetterDto): Promise<string> {
    try {
      const { email } = newsletter;

      await this.mailService.subscribe(email, 'newsletter');

      return 'Successfully Subscribed to newsletter';
    } catch (error) {
      this.logger.error(
        'Error subscribing to newsletter:',
        JSON.stringify(error, null, 3),
      );

      if (error?.response?.text) {
        const responseText = JSON.parse(error.response.text);

        if (responseText.code === 'duplicate_parameter') {
          throw new HttpException(
            'Email already subscribed',
            HttpStatus.CONFLICT,
          );
        }

        return 'Contact already exists';
      }
      throw error;
    }
  }
}
