import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ContactUsUseCase } from '../use-cases';
import { ContactUs } from 'src/domain/contactUs/entities';
import { ContactUsDto } from '../dtos';
import { ContactUsMapper } from '../mappers';

@ApiTags('contact')
@Controller('contact')
export class ContactUsController {
  constructor(private readonly contactUsUseCase: ContactUsUseCase) {}

  @Post('create')
  @ApiOperation({ summary: 'Contact Us' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully sent message.',
  })
  public async ContactUs(
    @Body() contactUsDto: ContactUsDto,
  ): Promise<ContactUs> {
    const contact = await this.contactUsUseCase.execute(contactUsDto);
    return ContactUsMapper.toDto(contact);
  }
}
