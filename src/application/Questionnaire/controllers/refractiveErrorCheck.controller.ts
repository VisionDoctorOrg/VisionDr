import { Controller, Post, Body, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RefractiveErrorCheckUseCase } from '../use-cases';
import { RefractiveErrorCheckMapper } from '../mappers';
import { RefractiveErrorCheckResponseDto } from '../dtos';
import { CurrentUser, response } from 'src/common';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/domain/auth/guards';

@ApiTags('refractiveErrorCheck')
@Controller('refractiveErrorCheck')
export class RefractiveErrorCheckController {
  constructor(
    private readonly refractiveErrorCheckUseCase: RefractiveErrorCheckUseCase,
  ) {}

  @Post('questionnaire')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'refractiveErrorCheck' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully updated.',
  })
  @ApiBody({ type: RefractiveErrorCheckResponseDto })
  public async RefractiveErrorCheck(
    @Body() refractiveErrorCheckResponseDto: RefractiveErrorCheckResponseDto,
    @CurrentUser() user: User,
  ): Promise<response> {
    const refractiveErrorCheck = await this.refractiveErrorCheckUseCase.execute(
      user.id,
      refractiveErrorCheckResponseDto,
    );
    const response = RefractiveErrorCheckMapper.toDto(refractiveErrorCheck);

    return {
      status: true,
      message: 'Response successfully recorded',
      data: {
        ...response,
      },
    };
  }
}
