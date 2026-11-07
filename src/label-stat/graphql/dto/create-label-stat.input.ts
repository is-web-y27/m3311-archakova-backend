import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumberString, IsOptional, Matches } from 'class-validator';

@InputType()
export class CreateLabelStatInput {
    @IsNumberString({no_symbols: true})
    @IsNotEmpty()
    @Field(() => ID, {description: 'Id музыкального лейбла'})
    labelId: string;

    @IsNotEmpty()
    @IsNumberString()
    @Matches(/^\d{4}$/)
    @Field({description: 'Год статистики'})
    year: string;

    @IsNumberString()
    @IsNotEmpty()
    @Matches(/^\d{1,13}(\.\d{1,2})?$/)
    @Field({description: 'Доход музыкального лейбла'})
    revenue: string;

    @IsOptional()
    @IsNumberString()
    @Matches(/^(100(\.0{1,2})?|\d{1,2}(\.\d{1,2})?)$/)
    @Field({description: 'Доля музыкального лейбла на рынке', nullable: true})
    marketShare?: string;
}
