import {
  Controller,
  Post,
  Body,
  HttpStatus,
  UseGuards,
  Req,
  Res,
  Param,
  Logger,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { SubscriptionUseCase } from '../use-cases';
import { SubscriptionMapper } from '../mappers';
import { CreateSubscriptionDto, InitializeSubscription } from '../dtos';
import { Subscription } from 'src/domain/subscription/entities';
import { CurrentUser } from 'src/common';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/domain/auth/guards';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@ApiTags('subscription')
@Controller('subscription')
export class SubscriptionController {
  private readonly logger = new Logger(SubscriptionController.name);

  constructor(
    private readonly subscriptionUseCase: SubscriptionUseCase,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('initialize')
  @ApiOperation({ summary: 'Initialize subscription' })
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

  @UseGuards(JwtAuthGuard)
  @Post('cancel/:subscriptionId')
  public async cancelSubscription(
    //@CurrentUser() user: User,
    @Param('subscriptionId') subscriptionId: string,
  ) {
    return await this.subscriptionUseCase.cancelSubscription(subscriptionId);
  }

  @Post('webhook')
  async webhook(@Req() req: Request, @Res() res: Response) {
    this.logger.verbose('Subscription webhook received', req.body);

    const secret = this.configService.get<string>('JWT_SECRET');
    const hash = crypto
      .createHmac('sha512', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    this.logger.debug(hash == req.headers['x-paystack-signature']);
    if (hash == req.headers['x-paystack-signature']) {
      console.log(hash);
      const event = req.body;
      this.logger.verbose('Subscription hash data:', event);
    }

    const event = req.body;

    await this.subscriptionUseCase.handleWebhook(event, res);

    return res.sendStatus(200);
  }
}
