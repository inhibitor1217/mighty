import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DuplicateSessionException } from './exception/duplicate-session.exception';
import { FullRoomException } from './exception/full-room.exception';
import { MaxObserversExceededException } from './exception/max-observers-exceeded.exception';
import { MaxPlayersExceededException } from './exception/max-players-exceeded.exception';
import { NoSessionException } from './exception/no-session.exception';
import { SessionNotAllowedActionException } from './exception/session-not-allowed-action.exception';

@Injectable()
export class RoomExceptionsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((e) => {
        if (
          e instanceof DuplicateSessionException ||
          e instanceof FullRoomException ||
          e instanceof MaxObserversExceededException ||
          e instanceof MaxPlayersExceededException ||
          e instanceof NoSessionException
        ) {
          throw new BadRequestException(e.message);
        }

        if (e instanceof SessionNotAllowedActionException) {
          throw new ForbiddenException(e.message);
        }

        throw e;
      })
    );
  }
}
