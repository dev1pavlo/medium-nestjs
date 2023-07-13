import { UserType } from './user.type';

export interface IUserResponse {
  user: Omit<UserType, 'password'> & { token: string };
}
