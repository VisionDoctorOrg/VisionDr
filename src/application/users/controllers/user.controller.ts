import {
  Controller,
  Post,
  Body,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
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

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly updateUserUseCase: UpdateUserUseCase) {}

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
}
