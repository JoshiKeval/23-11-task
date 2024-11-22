import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  IsLowercase,
  IsOptional,
} from 'class-validator';

export class SignUpReqDto {
  @ApiProperty({
    example: 'keval',
    required: true,
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    example: 'password',
    required: true,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(10)
  readonly password: string;

  @ApiProperty({
    required: true,
    example: 'john@mail.com',
  })
  @Transform(({ value }: TransformFnParams) => value?.toLowerCase())
  @IsEmail()
  @IsLowercase()
  readonly email: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'image upload',
  })
  @IsOptional()
  image?: Express.Multer.File;
}
