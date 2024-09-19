import {
  Controller,
  Post,
  Body,
  HttpStatus,
  UseGuards,
  Logger,
  Put,
  Delete,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotificationPreferenceDto } from '../dtos';
import { CurrentUser, response } from 'src/common';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/domain/auth/guards';
import { NotificationUseCase } from '../use-cases';
import { MedicationReminderDto } from '../dtos/medication-reminder.dto';

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

  @UseGuards(JwtAuthGuard)
  @Post('medication-reminder')
  @ApiOperation({ summary: 'Create a new medication reminder' })
  @ApiResponse({
    status: 201,
    description: 'The reminder has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  async createMedicationReminder(
    @Body() createReminderDto: MedicationReminderDto,
    @CurrentUser() user: User,
  ) {
    return this.notificationUseCase.createMedicationReminder(
      user.id,
      createReminderDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('medication-reminder/:id')
  @ApiOperation({ summary: 'Delete a medication reminder' })
  @ApiResponse({
    status: 200,
    description: 'The reminder has been successfully deleted.',
  })
  async deleteReminder(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<response> {
    await this.notificationUseCase.deleteMedicationReminder(user.id, id);

    return {
      status: true,
      message: 'Deleted successfully',
      data: {},
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('medication-reminders')
  @ApiOperation({ summary: 'Get all medication reminders' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved all medication reminders successfully.',
  })
  async getAllReminders(@CurrentUser() user: User) {
    return this.notificationUseCase.getAllMedicationReminders(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('medication-reminders')
  @ApiOperation({ summary: 'Get all medication reminders for the day' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved all medication reminders successfully.',
  })
  async getTodayReminders(
    @CurrentUser() user: User,
    @Query('date') date: string,
  ) {
    this.logger.debug(date, user.id);
    return this.notificationUseCase.getRemindersForToday(user.id, date);
  }
}
