import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WaitlistUseCase } from '../use-cases/waitlist.use-case';
import { WaitlistDto } from '../dtos/waitlist.dto';
import { Waitlist } from 'src/domain/waitlist/entities';
import { WaitlistMapper } from '../mappers/waitlist.mapper';

@ApiTags('waitlist')
@Controller('waitlist')
export class WaitlistController {
  constructor(private readonly waitlistUseCase: WaitlistUseCase) {}

  @Post('create')
  @ApiOperation({ summary: 'Join waitlist' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully joined waitlist.',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User already exist.',
  })
  public async waitlist(@Body() waitlistDto: WaitlistDto): Promise<Waitlist> {
    const waitlist = await this.waitlistUseCase.execute(waitlistDto);
    return WaitlistMapper.toDto(waitlist);
  }
}
