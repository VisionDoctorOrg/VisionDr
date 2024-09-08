import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionDto {
  @ApiProperty({
    example: 'Basic',
    description: 'Message Body',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  plan: string;

  @ApiProperty({
    example: 'Amount',
    description: 'Message Body',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  amount: string;
}
