import { Field, ID, InputType } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateFeedbackInput {
    @IsNumberString({no_symbols: true})
    @IsNotEmpty()
    @Field(() => ID, {description: 'Id пользователя'})
    userId: string;

    @IsNotEmpty()
    @IsString()
    @Field({description: 'Текст отзыва'})
    message: string;

    @IsOptional()
    @IsNumberString()
    @IsIn(['1', '2', '3', '4', '5'])
    @Field({description: 'Оценка пользователя', nullable: true})
    rating?: string;
}
