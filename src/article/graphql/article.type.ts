import { ObjectType, Field, Int} from '@nestjs/graphql';
import { UserTypeGraphql } from 'src/user/graphql/user.type';
import { ArtistTypeGraphql } from 'src/artist/graphql/artist.type';
import { ArticleType } from './article-type.graphql-enum';


@ObjectType('Article')
export class ArticleTypeGraphql {
  @Field(() => Int, {description: 'Id статьи'})
  id: number;

  @Field(() => String, {description: 'Название статьи'})
  title: string;

  @Field(() => ArticleType, {description: 'Тип статьи'})
  type: ArticleType;

  @Field(() => String, {description: 'Краткое описание статьи', nullable: true})
  summary: string | null;

  @Field(() => String, {description: 'Полный текст статьи'})
  content: string;

  @Field(() => UserTypeGraphql, {description: 'Автор статьи'})
  author: UserTypeGraphql;

  @Field(() => ArtistTypeGraphql, {description: 'Артист, связанный со статьей', nullable: true})
  artist: ArtistTypeGraphql | null;

  @Field(() => Date, {description: 'Дата публикации статьи', nullable: true})
  publishedAt: Date | null;

  @Field(() => Date, {description: 'Дата создания статьи'})
  createdAt: Date;

  @Field(() => Date, {description: 'Дата обновления статьи'})
  updatedAt: Date;
}
