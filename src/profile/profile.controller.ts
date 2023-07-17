import { Controller, Get, Param } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileResponse } from './types/profileResponse.interface';
import { User } from '@app/user/decorators/user.decorator';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  @Get(':username')
  async getProfile(
    @Param('username') username: string,
    @User('id') currentUserId: number,
  ): Promise<ProfileResponse> {
    const user = await this.profileService.getByUsername(
      username,
      currentUserId,
    );

    return this.profileService.dumpProfile(user);
  }
}
