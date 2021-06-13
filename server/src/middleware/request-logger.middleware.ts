import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import _ from 'lodash';
import { ConsoleColor } from '../utils/console-color';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private logger: Logger = new Logger('RequestLoggerMiddleware');

  private readonly methodColor: ConsoleColor = ConsoleColor.Yellow;
  private readonly pathColor: ConsoleColor = ConsoleColor.White;

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');

      this.logger.log(
        _.compact([
          ConsoleColor.apply(method, this.methodColor),
          ConsoleColor.apply(originalUrl, this.pathColor),
          JSON.stringify({ statusCode, contentLength, userAgent, ip }),
        ]).join(' ')
      );
    });

    next();
  }
}
