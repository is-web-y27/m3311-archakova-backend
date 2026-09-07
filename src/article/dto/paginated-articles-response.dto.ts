import { ApiProperty } from '@nestjs/swagger';
import { ArticleResponseDto } from './article-response.dto';

export class PaginatedArticlesResponseDto {
  @ApiProperty({ type: [ArticleResponseDto] })
  items: ArticleResponseDto[];

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 37 })
  total: number;

  @ApiProperty({ example: 4 })
  totalPages: number;
}