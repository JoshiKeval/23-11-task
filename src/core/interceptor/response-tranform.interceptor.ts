import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { get } from 'lodash';

/**
 * @description Success response
 */
export interface Response<T> {
  data: T;
  message?: string;
  isError?: boolean;
}

/**
 * @description Response transformer
 * Transforms object to valid json response
 */
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  private readonly logger = new Logger('TransformInterceptor');

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<Response<T>>> {
    const request = context.switchToHttp().getRequest();
    const headers = JSON.parse(JSON.stringify(request.headers || {}));
    delete headers['x-access-token'];
    delete headers['authorization'];

    return next.handle().pipe(
      map((result: { data: any; message?: string }) => {
        const response = {
          isError: false,
          code: 0,
          message: get(result, 'message', ''),
          data: result.data ? result.data : {},
        };

        this.logger.log(
          'Response',
          `${request.url}`,
          new Date().toISOString(),
          JSON.stringify(
            {
              request: {
                requestId: request?.['requestId'] || undefined,
                headers,
                body: request.body,
                params: request.params,
                query: request.query,
                url: request.url,
                method: request.method,
                ip: request.ips.length ? request.ips[0] : request.ip,
              },
              response,
            },
            null,
            2,
          ),
        );

        return response;
      }),
    );
  }
}
