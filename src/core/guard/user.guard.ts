import { User } from '@core/database/mongodb/schema';
import { Status } from '@core/interfaces';
import { ErrorMessages, jwtVerify } from '@core/utils';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TokenExpiredError } from 'jsonwebtoken';
import { Model } from 'mongoose';

@Injectable()
export class UserAuthGuard implements CanActivate {
  logger = new Logger('UserAuthGuard');
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token =
      request.headers['x-access-token'] || request.headers['authorization'];

    if (!token) {
      this.logger.error(
        'UserAuthGuard->>token-not-provide',
        new Date().toISOString(),
      );
      throw new UnauthorizedException();
    }

    try {
      const user = await jwtVerify(token);
      if (!user) {
        throw new UnauthorizedException(ErrorMessages.UNAUTHORIZED);
      }

      request.user = user;
      const result = await this.userModel.findOne({ _id: user.id });

      if (result?.status === Status.Inactive) {
        throw new UnauthorizedException(ErrorMessages.UNAUTHORIZED);
      }
      return request;
    } catch (e) {
      this.logger.error('UserAuthGuard', new Date().toISOString(), {
        e,
      });
      if (e instanceof TokenExpiredError) {
        throw new UnauthorizedException(ErrorMessages.TOKEN_EXPIRED);
      }
      throw new UnauthorizedException();
    }
  }
}
