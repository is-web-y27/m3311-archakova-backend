import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';
import { CreateArticleDto } from './create-article.dto';

export class CreateAuthenticatedArticleDto extends OmitType(CreateArticleDto, [
  'authorId',
] as const) {
  @ApiPropertyOptional({ example: '1', description: 'ID автора для администратора' })
  @IsOptional()
  @IsNumberString()
  authorId?: string;
}
