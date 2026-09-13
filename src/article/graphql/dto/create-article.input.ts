import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsNumberString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ArticleType } from '../article-type.graphql-enum';

@InputType()
export class CreateArticleInput {
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  @Field({ description: 'Название статьи' })
  title: string;

  @IsEnum(ArticleType)
  @Field(() => ArticleType, { description: 'Тип статьи'})
  type: ArticleType;  

  @IsOptional()
  @IsString()
  @Field({description: 'Краткое описание статьи', nullable: true})
  summary?: string;

  @IsNotEmpty()
  @IsString()
  @Field({description: 'Полный текст статьи'})
  content: string;

  @IsNumberString({no_symbols: true})
  @IsNotEmpty()
  @Field(() => ID, {description: 'Id автора статьи'})
  authorId: string;

  @IsOptional()
  @IsNumberString({no_symbols: true})
  @Field(() => ID, {description: 'Id артиста, связанного со статьей', nullable: true})
  artistId?: string;
}
