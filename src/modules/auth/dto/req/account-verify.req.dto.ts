import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class AccountVerifyReqDto {
  @ApiProperty({
    type: String,
    name: 'token',
    description: 'token used to verify user',
  })
  @Transform((tr) => tr.value.trim())
  @IsNotEmpty()
  readonly token!: string;
}
