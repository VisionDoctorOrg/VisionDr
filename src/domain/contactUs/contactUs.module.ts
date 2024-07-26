import { Logger, Module } from '@nestjs/common';
import { PrismaService } from 'src/common';
import {
  ContactUsController,
  ContactUsMapper,
  ContactUsUseCase,
} from 'src/application/contactUs';
import { ContactUsRepository } from './interfaces';
import { contactRepository } from 'src/infrastructure/repositories/contactUs.repository';
import { ContactUsService } from './services';
import { MailService } from 'src/common/mail/mail.service';
import { MailModule } from 'src/common/mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [ContactUsController],
  providers: [
    ContactUsService,
    MailService,
    PrismaService,
    ContactUsUseCase,
    ContactUsMapper,
    Logger,
    {
      provide: ContactUsRepository,
      useClass: contactRepository,
    },
  ],
})
export class ContactUsModule {}
