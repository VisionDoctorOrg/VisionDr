import { Logger, Module } from '@nestjs/common';
import { PrismaService } from 'src/common';
import { WaitlistController } from 'src/application/waitlist/controllers/waitlist.controller';
import {
  ContactUsController,
  ContactUsMapper,
  ContactUsUseCase,
} from 'src/application/contactUs';
import { ContactUsRepository } from './interfaces';
import { contactRepository } from 'src/infrastructure/repositories/contactUs.repository';
import { ContactUsService } from './services';

@Module({
  controllers: [ContactUsController],
  providers: [
    ContactUsService,
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
