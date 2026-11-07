import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ArticleTypeGraphql } from 'src/article/graphql/article.type';
import { FeedbackTypeGraphql } from 'src/feedback/graphql/feedback.type';
import { UserRole } from './user-role.enum';

@ObjectType('User')
export class UserTypeGraphql {
  @Field(() => Int, {description: 'Id пользователя'})
  id: number;

  @Field({description: 'Имя пользователя'})
  name: string;

  @Field({description: 'Почта пользователя'})
  email: string;

  @Field(() => UserRole, {description: 'Роль пользователя'})
  role: UserRole;

  @Field(() => [ArticleTypeGraphql], {description: 'Статьи пользователя'})
  articles: ArticleTypeGraphql[];

  @Field(() => [FeedbackTypeGraphql], {description: 'Отзывы пользователя'})
  feedbacks: FeedbackTypeGraphql[];

  @Field(() => Date, {description: 'Дата создания пользователя'})
  createdAt: Date;

  @Field(() => Date, {description: 'Дата обновления пользователя'})
  updatedAt: Date;
}
