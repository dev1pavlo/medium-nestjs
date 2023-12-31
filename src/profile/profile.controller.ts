import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileResponse } from './types/profileResponse.interface';
import { User } from 'user/decorators/user.decorator';
import { AuthGuard } from 'user/guards/auth.guard';

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

  @Post(':username/follow')
  @UseGuards(AuthGuard)
  async followProfile(
    @Param('username') username: string,
    @User('id') currentUserId: number,
  ): Promise<ProfileResponse> {
    const user = await this.profileService.followProfile(
      username,
      currentUserId,
    );

    return this.profileService.dumpProfile(user);
  }

  @Delete(':username/follow')
  @UseGuards(AuthGuard)
  async unfollowProfile(
    @Param('username') username: string,
    @User('id') currentUserId: number,
  ): Promise<ProfileResponse> {
    const user = await this.profileService.unfollowProfile(
      username,
      currentUserId,
    );

    return this.profileService.dumpProfile(user);
  }
}
