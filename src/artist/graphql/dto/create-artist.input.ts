import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumberString, IsOptional, IsString, MaxLength } from 'class-validator';

@InputType()
export class CreateArtistInput {
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  @Field({description: 'Имя артиста'})
  stageName: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Field({description: 'Жанр', nullable: true})
  genre?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Field({description: 'Страна исполнителя', nullable: true})
  country?: string;

  @IsOptional()
  @IsNumberString({no_symbols: true})
  @Field(() => ID, {description: 'Id музыкального лейбла', nullable: true})
  labelId?: string;
}
