import { TransformInterceptor } from '@core/interceptor';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AccountVerifyReqDto, SignInReqDto, SignUpReqDto } from './dto';
import { SuccessMessages } from '@core/utils';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Auth Apis')
@UseInterceptors(TransformInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('/sign-up')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Api for register user',
    description: 'Api for register user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: SuccessMessages.SIGN_UP,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async register(
    @Body() payload: SignUpReqDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return { message: await this.service.signUp(payload, image) };
  }

  @Post('/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Api to verify user account',
    description: 'Api to verify user account',
  })
  @ApiResponse({
    description: SuccessMessages.MAIL_VERIFY,
  })
  async verifyAccount(@Body() payload: AccountVerifyReqDto) {
    return {
      message: await this.service.verifyAccount(payload),
    };
  }

  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Api to signIn user',
    description: 'Api to signIn user',
  })
  @ApiResponse({
    description: SuccessMessages.SIGN_IN,
  })
  async signIn(@Body() payload: SignInReqDto) {
    return {
      data: await this.service.signIn(payload),
    };
  }
}
