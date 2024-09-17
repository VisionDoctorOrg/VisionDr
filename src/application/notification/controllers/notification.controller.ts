import {
  Controller,
  Post,
  Body,
  HttpStatus,
  UseGuards,
  Logger,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotificationPreferenceDto } from '../dtos';
import { CurrentUser } from 'src/common';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/domain/auth/guards';
import { NotificationUseCase } from '../use-cases';

@ApiTags('notification')
@Controller('notification')
export class NotificationController {
  private readonly logger = new Logger(NotificationController.name);

  constructor(private readonly notificationUseCase: NotificationUseCase) {}

  @UseGuards(JwtAuthGuard)
  @Put('preferences')
  @ApiOperation({ summary: 'Update notification preferences' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully updated preferences',
  })
  async updatePreferences(
    @CurrentUser() user: User,
    @Body() notificationPreferenceDto: NotificationPreferenceDto,
  ) {
    return this.notificationUseCase.notificationPreference(
      user.id,
      notificationPreferenceDto,
    );
  }
}
