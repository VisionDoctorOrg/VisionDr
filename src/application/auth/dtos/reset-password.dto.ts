import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'hgytsferayahsud2h7s837ss7hshsn%%****nsw',
    description: 'Token',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({
    example: 'StrongPassword123!',
    description: 'The password of the user',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  newPassword: string;

  @ApiProperty({
    example: 'StrongPassword123!',
    description: 'Confirm password',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
}
