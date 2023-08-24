import { UserEntity } from 'user/user.entity';
import { type Request } from 'express';

export interface IExpressRequest extends Request {
  user?: UserEntity;
}
