import { Controller, Post, Body, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CaseFileUseCase } from '../use-cases';
import { CaseFileMapper } from '../mappers';
import { CaseFileResponseDto } from '../dtos';
import { CurrentUser, response } from 'src/common';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/domain/auth/guards';

@ApiTags('casefile')
@Controller('casefile')
export class CaseFileController {
  constructor(private readonly caseFileUseCase: CaseFileUseCase) {}

  @Post('questionnaire')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'CaseFile' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully recorded Casefile.',
  })
  @ApiBody({ type: CaseFileResponseDto })
  public async CaseFile(
    @Body() caseFileResponseDto: CaseFileResponseDto,
    @CurrentUser() user: User,
  ): Promise<response> {
    const caseFile = await this.caseFileUseCase.execute(
      user.id,
      caseFileResponseDto,
    );
    const response = CaseFileMapper.toDto(caseFile);

    return {
      status: true,
      message: 'Response successfully recorded',
      data: {
        ...response,
      },
    };
  }
}
