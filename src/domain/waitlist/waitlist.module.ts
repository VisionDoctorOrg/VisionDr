import { Logger, Module } from '@nestjs/common';
import { PrismaService } from 'src/common';
import { WaitlistService } from './services/waitlist.service';
import { WaitlistUseCase } from 'src/application/waitlist/use-cases/waitlist.use-case';
import { WaitlistMapper } from 'src/application/waitlist/mappers/waitlist.mapper';
import { WaitlistRepository } from './interfaces';
import { waitlistRepository } from 'src/infrastructure/repositories/waitlist.repository';
import { WaitlistController } from 'src/application/waitlist/controllers/waitlist.controller';

@Module({
  controllers: [WaitlistController],
  providers: [
    WaitlistService,
    PrismaService,
    WaitlistUseCase,
    WaitlistMapper,
    Logger,
    {
      provide: WaitlistRepository,
      useClass: waitlistRepository,
    },
  ],
})
export class WaitlistModule {}
