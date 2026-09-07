import { IsEnum, IsNotEmpty, IsNumberString, IsOptional, IsString, MaxLength } from "class-validator";
import { ArticleType } from "../entities/article-type.enum";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateArticleDto {
    @ApiProperty({example: 'Новый альбом исполнителя', description: 'Название статьи'})
    @IsNotEmpty()
    @IsString()
    @MaxLength(200)
    title: string;

    @ApiProperty({enum: ArticleType, example: ArticleType.REVIEW, description: 'Тип статьи'})
    @IsEnum(ArticleType)
    type: ArticleType;

    @ApiPropertyOptional({example: 'Краткое описание статьи', description: 'Краткое содержание статьи'})
    @IsOptional()
    @IsString()
    summary?: string;

    @ApiProperty({example: 'Полный текст статьи...',description: 'Содержание статьи'})
    @IsNotEmpty()
    @IsString()
    content: string;

    @ApiProperty({example: '1',description: 'ID автора статьи'})
    @IsNumberString({no_symbols: true})
    @IsNotEmpty()
    authorId: string;
    @ApiPropertyOptional({example: '1', description: 'ID артиста, связанного со статьёй'})
    @IsOptional()
    @IsNumberString({no_symbols: true})
    artistId?: string;
}
