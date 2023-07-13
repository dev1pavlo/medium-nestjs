import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dtop';
import { sign } from 'jsonwebtoken';
import { JWT_TOKEN } from '@app/config';
import { IUserResponse } from './types/userResponse.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    const userByUsername = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (userByEmail || userByUsername) {
      throw new HttpException(
        'Email or username are taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    return this.userRepository.save(newUser);
  }

  dumpUser(user: UserEntity): IUserResponse {
    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        bio: user.bio,
        image: user.image,
        token: this.generateJwt(user),
      },
    };
  }

  generateJwt(user: UserEntity): string {
    console.log(JWT_TOKEN);

    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      JWT_TOKEN,
    );
  }
}
