import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from './article.entity';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { UserEntity } from '@app/user/user.entity';
import { CreateArticleDto } from './dto/createArticle.dto';
import { IArticleResponse } from './types/articleResponse.interface';
import slugify from 'slugify';
import { UpdateArticleDto } from './dto/updateArticle.dto';
import { IArticlesResponse } from './types/articlesResponse.interface';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
  ) {}

  async findAll(userId: number, query: any): Promise<IArticlesResponse> {
    const queryBuilder = this.dataSource
      .getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author');

    queryBuilder.orderBy('articles.createdAt', 'DESC');

    if (query.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        tag: `%${query.tag}%`,
      });
    }

    if (query.author) {
      const author = await this.userRepository.findOne({
        where: { username: query.author },
      });
      if (!author)
        throw new HttpException('Not found user', HttpStatus.NOT_FOUND);
      queryBuilder.andWhere('articles.authorId = :id', {
        id: author.id,
      });
    }

    const articlesCount = await queryBuilder.getCount();

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    const articles = await queryBuilder.getMany();

    return { articles, articlesCount };
  }

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

  async findBySlug(slug: string): Promise<ArticleEntity> {
    return this.articleRepository.findOne({
      where: { slug },
    });
  }

  async deleteBySlug(userId: number, slug: string): Promise<DeleteResult> {
    const article = await this.findBySlug(slug);

    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }

    if (article.author.id !== userId) {
      throw new HttpException('Now allowed', HttpStatus.FORBIDDEN);
    }

    return this.articleRepository.delete({ slug });
  }

  async updateBySlug(
    userId: number,
    slug: string,
    updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);
    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }

    if (article.author.id !== userId) {
      throw new HttpException('Now allowed', HttpStatus.FORBIDDEN);
    }

    Object.assign(article, updateArticleDto);
    if (updateArticleDto.title) {
      article.slug = this.getSlug(updateArticleDto.title);
    }

    return this.articleRepository.save(article);
  }

  private getSlug(title: string) {
    return `${slugify(title, { lower: true })}-${(
      (Math.random() * Math.pow(36, 6)) |
      0
    ).toString(36)}`;
  }

  async addToFavorites(slug: string, userId: number): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);
    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: {
        favorites: true,
      },
    });
    const isNotFavorited =
      user.favorites.findIndex(
        (favoritedArticle) => favoritedArticle.id === article.id,
      ) === -1;

    if (isNotFavorited) {
      user.favorites.push(article);
      article.favoritesCount++;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }

    return article;
  }

  async removeFromFavorites(
    slug: string,
    userId: number,
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);
    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: {
        favorites: true,
      },
    });

    const articleIndex = user.favorites.findIndex(
      (favoritedArticle) => favoritedArticle.id === article.id,
    );

    if (articleIndex >= 0) {
      user.favorites.splice(articleIndex, 1);
      article.favoritesCount--;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }

    return article;
  }
}
