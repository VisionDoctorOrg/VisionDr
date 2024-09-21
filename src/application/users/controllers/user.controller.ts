import {
  Controller,
  Post,
  Body,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  Put,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { UpdateUserUseCase } from '../use-cases/update-user-profile-use-case';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { JwtAuthGuard } from 'src/domain/auth/guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser, response } from 'src/common';
import { User } from '@prisma/client';
import { UpdateAdditionalInfoDto } from '../dtos/additional-info.dto';
import { AdditionalInforUseCase } from '../use-cases/additional-info-use-case';
import { CreateBloodPressureDto, CreateVisionDto } from '../dtos';
import { BloodPressureUseCase } from '../use-cases/blood-pressure.usecase';
import { VisionLevelUseCase } from '../use-cases/vision-level.usecase';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly additionalInforUseCase: AdditionalInforUseCase,
    private readonly bloodPressureUseCase: BloodPressureUseCase,
    private readonly visionLevelUseCase: VisionLevelUseCase
  ) {}

  @Post('update-user-profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update User profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User profile successfully updated',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update user profile data',
    type: UpdateUserDto,
    required: true,
  })
  @ApiBody({
    description: 'User profile image',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async updateUserProfile(
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: User,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /jpeg|jpg|png/,
        })
        .addMaxSizeValidator({
          maxSize: 5000000,
        })
        .build({
          fileIsRequired: false,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ): Promise<response> {
    const response = await this.updateUserUseCase.execute(
      user.id,
      updateUserDto,
      file,
    );

    return {
      status: true,
      message: 'User profile successfully updated',
      data: { ...response },
    };
  }

  @Put('additional-info')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update additional information' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Additional information successfully updated',
  })
  async updateAdditionalInfo(
    @Body() updateAdditionalInfoDto: UpdateAdditionalInfoDto,
    @CurrentUser() user: User,
  ) {
    const response = await this.additionalInforUseCase.execute(
      user.id,
      updateAdditionalInfoDto,
    );

    return {
      status: true,
      message: 'Additional information successfully updated',
      data: response,
    };
  }


  @Put('blood-pressure')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update blood pressure' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Blood pressure successfully updated',
  })
  async updateBloodPressure(
    @Body() createBloodPressureDto: CreateBloodPressureDto,
    @CurrentUser() user: User,
  ) {
    const response = await this.bloodPressureUseCase.execute(
      user.id,
      createBloodPressureDto,
    );

    return {
      status: true,
      message: 'Blood pressure successfully updated',
      data: response,
    };
  }


  @Put('vision-level')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update vision level' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Vision level successfully updated',
  })
  async updateVisionLevel(
    @Body() createVisionDto: CreateVisionDto,
    @CurrentUser() user: User,
  ) {
    const response = await this.visionLevelUseCase.execute(
      user.id,
      createVisionDto,
    );

    return {
      status: true,
      message: 'Vision level successfully updated',
      data: response,
    };
  }
}
