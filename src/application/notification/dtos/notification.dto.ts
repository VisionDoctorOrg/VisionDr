import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class NotificationPreferenceDto {
  @ApiProperty({
    example: true,
    description: 'Enable or disable email notifications',
  })
  @IsBoolean()
  @IsOptional()
  emailEnabled?: boolean;

  @ApiProperty({
    example: false,
    description: 'Enable or disable SMS notifications',
  })
  @IsBoolean()
  @IsOptional()
  smsEnabled?: boolean;

  @ApiProperty({
    example: false,
    description: 'Enable or disable WhatsApp notifications',
  })
  @IsBoolean()
  @IsOptional()
  whatsappEnabled?: boolean;

  @ApiProperty({
    example: true,
    description: 'Enable or disable medication reminders',
  })
  @IsBoolean()
  @IsOptional()
  medicationReminder?: boolean;

  @ApiProperty({
    example: true,
    description: 'Enable or disable payment reminders',
  })
  @IsBoolean()
  @IsOptional()
  paymentReminder?: boolean;

}
