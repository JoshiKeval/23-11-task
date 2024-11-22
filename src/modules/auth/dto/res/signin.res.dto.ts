import { ApiProperty } from '@nestjs/swagger';

export class SignInResDto {
  @ApiProperty({
    type: String,
    description: 'Id of the registered user',
    name: 'id',
  })
  readonly userId: string;

  @ApiProperty({
    type: String,
    description: 'access token for authenticated user',
    name: 'token',
  })
  readonly token: string;

  constructor(id: string, token: string) {
    this.userId = id;
    this.token = token;
  }
}
