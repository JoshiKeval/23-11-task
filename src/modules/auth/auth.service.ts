import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  AccountVerifyReqDto,
  SignInReqDto,
  SignInResDto,
  SignUpReqDto,
} from './dto';
import {
  comparePassword,
  ErrorMessages,
  generateSHA1,
  hash,
  isImageValid,
  jwtSign,
  SuccessMessages,
} from '@core/utils';
import { MailService } from '../mail/mail.service';
import { Status } from '@core/interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@core/database/mongodb/schema';
import { Model } from 'mongoose';
import { extname } from 'path';
import { S3Service } from '@core/aws';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly mailService: MailService,
    private readonly s3Service: S3Service,
  ) {}

  async signUp(payload: SignUpReqDto, file: any): Promise<string> {
    const { email, name, password } = payload;

    const isUserExist = await this.userModel.findOne({ email });

    if (isUserExist) {
      throw new BadRequestException(ErrorMessages.ACCOUNT_ALREADY_EXIST);
    }

    const hashedPassword = await hash(password);
    const hashedEmail = generateSHA1(email);
    let url;
    if (file) {
      url = await this.uploadImage(uuidv4(), file);
    }
    const user = new this.userModel({
      name,
      email,
      password: hashedPassword,
      emailVerificationToken: hashedEmail,
      avatar: url
        ? url
        : `https://imt-task.s3.ap-south-1.amazonaws.com/demo.png`,
    });

    await user.save();
    this.mailService.sendRegistrationEmail(email, hashedEmail);

    return SuccessMessages.SIGN_UP;
  }

  async verifyAccount(payload: AccountVerifyReqDto): Promise<string> {
    const { token } = payload;
    const user = await this.userModel.findOne({
      emailVerificationToken: token,
    });
    if (!user) {
      throw new BadRequestException(ErrorMessages.USER_NOT_EXIST);
    }
    console.log(user?.isEmailVerified);

    if (user?.isEmailVerified) {
      throw new BadRequestException(ErrorMessages.ACCOUNT_ALREADY_VERIFIED);
    }

    user.status = Status.Active;
    user.emailVerifiedAt = new Date();
    user.isEmailVerified = true;
    await user.save();

    return SuccessMessages.MAIL_VERIFY;
  }

  async signIn(payload: SignInReqDto): Promise<SignInResDto> {
    const { email, password } = payload;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException(ErrorMessages.UNAUTHORIZED);
    }
    if (!user?.isEmailVerified) {
      throw new BadRequestException(ErrorMessages.VERIFICATION_PENDDING);
    }

    const isCorrectPassword = await comparePassword(password, user?.password);
    if (!isCorrectPassword) {
      throw new UnauthorizedException(ErrorMessages.UNAUTHORIZED);
    }

    const tokenPayload = {
      id: user.id,
      status: user.status,
    };

    const jwtToken = jwtSign(tokenPayload);
    return new SignInResDto(user?.id, jwtToken);
  }

  async uploadImage(id: string, file: any): Promise<string> {
    const isFileValid = isImageValid(file);
    const ext = extname(file.originalname);
    const key = `${id}/${Date.now()}${ext}`;
    if (!isFileValid) {
      throw new BadRequestException(ErrorMessages.IMAGE_FORMAT_NOT_VALID);
    }
    const objectUrl = await this.s3Service.uploadFile(file, key);
    return objectUrl;
  }
}
