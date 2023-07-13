import { JWT_TOKEN } from '@app/config';
import { IExpressRequest } from '@app/types/expressRequest.interface';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { UserService } from '../user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}
  async use(req: IExpressRequest, res: Response, next: NextFunction) {
    const { headers } = req;

    if (!headers.authorization) {
      req.user = null;
      next();
      return;
    }

    const token = headers.authorization.split(' ')[1];

    if (!token) {
      req.user = null;
      next();
      return;
    }

    try {
      const decoded = verify(token, JWT_TOKEN) as JwtPayload;
      req.user = await this.userService.findById(decoded.id);
      next();
    } catch (e) {
      req.user = null;
      next();
      return;
    }
  }
}
