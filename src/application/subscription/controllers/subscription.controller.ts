import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SubscriptionUseCase } from '../use-cases';
import { SubscriptionMapper } from '../mappers';
import { CreateSubscriptionDto } from '../dtos';
import { Subscription } from 'src/domain/subscription/entities';

@ApiTags('subscription')
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionUseCase: SubscriptionUseCase) {}

  @Post('initialize')
  @ApiOperation({ summary: 'Iniatialize subscription' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully generated link',
  })
  public async Subscription(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    const subscription = await this.subscriptionUseCase.execute(
      createSubscriptionDto,
    );
    return SubscriptionMapper.toDto(subscription);
  }
}
