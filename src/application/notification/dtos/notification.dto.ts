import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NotificationPreferenceDto {
  @ApiProperty({
    example: true,
    description: 'Enable or disable email notifications',
    required: true,
  })
  @IsBoolean()
  @IsOptional()
  email?: boolean;

  @ApiProperty({
    example: false,
    description: 'Enable or disable SMS notifications',
    required: true,
  })
  @IsBoolean()
  @IsOptional()
  sms?: boolean;

  @ApiProperty({
    example: false,
    description: 'Enable or disable WhatsApp notifications',
    required: true,
  })
  @IsBoolean()
  @IsOptional()
  whatsapp?: boolean;

  @ApiProperty({
    example: true,
    description: 'Enable or disable medication reminder notifications',
    required: true,
  })
  @IsBoolean()
  @IsOptional()
  medicationReminder?: boolean;

  @ApiProperty({
    example: true,
    description: 'Enable or disable payment reminder notifications',
    required: true,
  })
  @IsBoolean()
  @IsOptional()
  paymentReminder?: boolean;
}
