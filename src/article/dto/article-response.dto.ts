import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArticleType } from '../entities/article-type.enum';

class ArticleAuthorResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'bob' })
  name: string;

  @ApiProperty({ example: 'bob@bob.com' })
  email: string;

  @ApiProperty({ example: 'user' })
  role: string;

  @ApiProperty({ example: '2026-09-06T12:12:12.049Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-09-06T12:12:12.049Z' })
  updatedAt: Date;
}

class ArticleArtistResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Тимати' })
  stageName: string;

  @ApiPropertyOptional({ example: 'Реп, хип-хоп', nullable: true })
  genre: string | null;

  @ApiPropertyOptional({ example: 'Россия', nullable: true })
  country: string | null;

  @ApiProperty({ example: '2026-09-06T12:12:12.626Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-09-06T12:12:12.275Z' })
  updatedAt: Date;
}

export class ArticleResponseDto {
  @ApiProperty({ example: 3 })
  id: number;

  @ApiProperty({ example: 'Альбом Тимати' })
  title: string;

  @ApiProperty({
    enum: ArticleType,
    example: ArticleType.REVIEW,
  })
  type: ArticleType;

  @ApiPropertyOptional({
    example: 'Тимати выпустил альом',
    nullable: true,
  })
  summary: string | null;

  @ApiProperty({
    example: 'Полный текст статьи...',
  })
  content: string;

  @ApiProperty({ type: ArticleAuthorResponseDto })
  author: ArticleAuthorResponseDto;

  @ApiPropertyOptional({
    type: ArticleArtistResponseDto,
    nullable: true,
  })
  artist: ArticleArtistResponseDto | null;

  @ApiPropertyOptional({ example: '2026-09-06T12:12:12.905Z', nullable: true })
  publishedAt: Date | null;

  @ApiProperty({ example: '2026-09-06T12:12:12.329Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-09-06T12:12:12.329Z' })
  updatedAt: Date;
}
