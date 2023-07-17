import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { User } from '@app/user/decorators/user.decorator';
import { CreateArticleDto } from './dto/createArticle.dto';
import { IArticleResponse } from './types/articleResponse.interface';
import { UpdateArticleDto } from './dto/updateArticle.dto';
import { IArticlesResponse } from './types/articlesResponse.interface';
import { CustomValidationPipe } from '@app/shared/pipes/CustomValidation.pipe';
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async findAll(
    @User('id') currentUserId: number,
    @Query() query: any,
  ): Promise<IArticlesResponse> {
    return this.articleService.findAll(currentUserId, query);
  }

  @Post()
  @UsePipes(new CustomValidationPipe())
  @UseGuards(AuthGuard)
  async create(
    @User() currentUser,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<IArticleResponse> {
    const article = await this.articleService.createArticle(
      currentUser,
      createArticleDto,
    );

    return this.articleService.dumpArticle(article);
  }

  @Get(':slug')
  async getArticleBySlug(
    @Param('slug') slug: string,
  ): Promise<IArticleResponse> {
    const article = await this.articleService.findBySlug(slug);

    return this.articleService.dumpArticle(article);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deleteArticleBySlug(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ) {
    return this.articleService.deleteBySlug(currentUserId, slug);
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async updateArticleBySlug(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
    @Body('article') updateArticleDto: UpdateArticleDto,
  ): Promise<IArticleResponse> {
    const article = await this.articleService.updateBySlug(
      currentUserId,
      slug,
      updateArticleDto,
    );

    return this.articleService.dumpArticle(article);
  }

  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  async addToFavorites(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<IArticleResponse> {
    const article = await this.articleService.addToFavorites(
      slug,
      currentUserId,
    );

    return this.articleService.dumpArticle(article);
  }

  @Delete(':slug/favorite')
  @UseGuards(AuthGuard)
  async removeFromFavorites(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<IArticleResponse> {
    const article = await this.articleService.removeFromFavorites(
      slug,
      currentUserId,
    );

    return this.articleService.dumpArticle(article);
  }
}
