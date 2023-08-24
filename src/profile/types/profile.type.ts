import { UserType } from 'user/types/user.type';

export type ProfileType = Pick<UserType, 'username' | 'bio' | 'image'> & {
  following: boolean;
};
