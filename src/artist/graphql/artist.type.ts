import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ArticleTypeGraphql } from 'src/article/graphql/article.type';
import { MusicLabelTypeGraphql } from 'src/music-label/graphql/music-label.type';

@ObjectType('Artist')
export class ArtistTypeGraphql {
  @Field(() => Int, {description: 'Id артиста'})
  id: number;

  @Field({description: 'Имя артиста'})
  stageName: string;

  @Field(() => String, {description: 'Жанр', nullable: true})
  genre: string | null;

  @Field(() => String, {description: 'Страна исполнителя', nullable: true})
  country: string | null;

  @Field(() => MusicLabelTypeGraphql, {description: 'Музыкальный лейбл артиста', nullable: true})
  label: MusicLabelTypeGraphql | null;

  @Field(() => [ArticleTypeGraphql], {description: 'Статьи, связанные с артистом'})
  articles: ArticleTypeGraphql[];

  @Field(() => Date, {description: 'Дата создания артиста'})
  createdAt: Date;

  @Field(() => Date, {description: 'Дата обновления артиста'})
  updatedAt: Date;
}
