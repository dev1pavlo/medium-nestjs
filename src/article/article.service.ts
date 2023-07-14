import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from './article.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '@app/user/user.entity';
import { CreateArticleDto } from './dto/createArticle.dto';
import { IArticleResponse } from './types/articleResponse.interface';
import slugify from 'slugify';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}
  async createArticle(
    user: UserEntity,
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity();
    Object.assign(article, createArticleDto);

    if (!createArticleDto.tagList) article.tagList = [];

    article.slug = this.getSlug(article.title);
    article.author = user;

    return this.articleRepository.save(article);
  }

  dumpArticle(article: ArticleEntity): IArticleResponse {
    return {
      article,
    };
  }

  private getSlug(title: string) {
    return `${slugify(title, { lower: true })}-${(
      (Math.random() * Math.pow(36, 6)) |
      0
    ).toString(36)}`;
  }
}
