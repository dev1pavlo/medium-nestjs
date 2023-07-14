import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { User } from '@app/user/decorators/user.decorator';
import { CreateArticleDto } from './dto/createArticle.dto';
import { IArticleResponse } from './types/articleResponse.interface';
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
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
}
