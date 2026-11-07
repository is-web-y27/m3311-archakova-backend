import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

@InputType()
export class CreateMusicLabelInput {
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    @Field({description: 'Название музыкального лейбла'})
    name: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    @Field({description: 'Страна музыкального лейбла', nullable: true})
    country?: string;

    @IsOptional()
    @IsString()
    @Field({description: 'Описание музыкального лейбла', nullable: true})
    description?: string;
}
