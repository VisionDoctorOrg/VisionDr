import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionDto {
  @ApiProperty({
    example: 'PLN_fti42oat316rpp5',
    description: 'Message Body',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  plan: string;

  @ApiProperty({
    example: '500',
    description: 'Message Body',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}

export class CancelSubscriptionDto {
  @ApiProperty({
    example: 'PLN_fti42oat316rpp5',
    description: 'Message Body',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  subscriptionId: string;
}

export interface InitializeSubscription {
  status: string;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}
