import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  BadGatewayException,
  CallHandler,
  RequestTimeoutException,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { Observable, TimeoutError, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
// import { QueryFailedError } from 'typeorm/error/QueryFailedError';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(5000),
      catchError((err) => {
        // console.log('error', err);
        if (err) {
          if (err instanceof TimeoutError) {
            return throwError(() => new RequestTimeoutException());
          } else if (err instanceof UnauthorizedException) {
            return throwError(() => new UnauthorizedException());
          } else if (err instanceof BadRequestException) {
            return throwError(() => new BadRequestException());
          }
          // else if (err instanceof QueryFailedError) {
          //   console.log('instanc', err);
          //   throw new BadRequestException(
          //     `column ${err.driverError.column} is missing`,
          //   );
          // }
          else if (err.code === '23502') {
            throw new BadRequestException(
              `column ${err.driverError.column} is missing`,
            );
          } else if (err.code === '23505') {
            throw new ConflictException('username already exist');
          }
          return throwError(() => new BadGatewayException());
        }
      }),
    );
  }
}
