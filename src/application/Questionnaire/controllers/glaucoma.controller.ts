import { Controller, Post, Body, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GlaucomaUseCase } from '../use-cases';
import { GlaucomaMapper } from '../mappers';
import { GlaucomaResponseDto } from '../dtos';
import { CurrentUser, response } from 'src/common';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/domain/auth/guards';

@ApiTags('glaucoma')
@Controller('glaucoma')
export class GlaucomaController {
  constructor(private readonly glaucomaUseCase: GlaucomaUseCase) {}

  @Post('questionnaire')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'refractiveErrorCheck' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully updated.',
  })
  public async Glaucoma(
    @Body() glaucomaResponseDto: GlaucomaResponseDto,
    @CurrentUser() user: User,
  ): Promise<response> {
    const glaucoma = await this.glaucomaUseCase.execute(
      user.id,
      glaucomaResponseDto,
    );
    const response = GlaucomaMapper.toDto(glaucoma);

    return {
      status: true,
      message: 'Response successfully recorded',
      data: {
        ...response,
      },
    };
  }
}
