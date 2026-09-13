import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserTypeGraphql } from 'src/user/graphql/user.type';

@ObjectType('Feedback')
export class FeedbackTypeGraphql {
    @Field(() => Int, {description: 'Id отзыва'})
    id: number;

    @Field(() => UserTypeGraphql, {description: 'Пользователь, оставивший отзыв'})
    user: UserTypeGraphql;

    @Field({description: 'Текст отзыва'})
    message: string;

    @Field(() => Int, {description: 'Оценка пользователя'})
    rating: number;

    @Field(() => Date, {description: 'Дата создания отзыва'})
    createdAt: Date;
}
