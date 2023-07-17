import { UserEntity } from '@app/user/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileResponse } from './types/profileResponse.interface';
import { ProfileType } from './types/profile.type';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async getByUsername(
    username: string,
    currentUserId: number,
  ): Promise<ProfileType> {
    const user = await this.userRepository.findOne({ where: { username } });

    const following = false;

    if (currentUserId) {
      // change here
    }

    return { ...user, following };
  }

  dumpProfile(profile: ProfileType): ProfileResponse {
    return {
      profile: {
        username: profile.username,
        bio: profile.bio,
        image: profile.image,
        following: profile.following,
      },
    };
  }
}
