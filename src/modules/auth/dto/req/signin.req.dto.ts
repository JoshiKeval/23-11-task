import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsEmail,
  IsLowercase,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignInReqDto {
  @ApiProperty({
    required: true,
    example: 'john@mail.com',
  })
  @Transform(({ value }: TransformFnParams) => value?.toLowerCase())
  @IsEmail()
  @IsLowercase()
  readonly email: string;

  @ApiProperty({
    example: 'password',
    required: true,
  })
  @MinLength(6)
  @MaxLength(10)
  @IsString()
  readonly password: string;
}
