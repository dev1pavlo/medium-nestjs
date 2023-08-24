import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { AuthGuard } from 'user/guards/auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './article.entity';
import { UserEntity } from 'user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity, UserEntity])],
  controllers: [ArticleController],
  providers: [ArticleService, AuthGuard],
})
export class ArticleModule {}
