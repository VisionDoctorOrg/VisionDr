import { Controller, Post, Body, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SubscriptionUseCase } from '../use-cases';
import { SubscriptionMapper } from '../mappers';
import { CreateSubscriptionDto, InitializeSubscription } from '../dtos';
import { Subscription } from 'src/domain/subscription/entities';
import { CurrentUser } from 'src/common';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/domain/auth/guards';

@ApiTags('subscription')
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionUseCase: SubscriptionUseCase) {}

  @UseGuards(JwtAuthGuard)
  @Post('initialize')
  @ApiOperation({ summary: 'Iniatialize subscription' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully generated link',
  })
  public async Subscription(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
    @CurrentUser() user: User,
  ): Promise<InitializeSubscription> {
    return await this.subscriptionUseCase.InitializeSubscription(
      user.id,
      createSubscriptionDto,
    );
  }
}
