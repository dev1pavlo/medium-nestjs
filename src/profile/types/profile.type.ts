import { UserType } from '@app/user/types/user.type';

export type ProfileType = Pick<UserType, 'username' | 'bio' | 'image'> & {
  following: boolean;
};
