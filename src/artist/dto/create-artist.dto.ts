import { IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateArtistDto {
    @ApiProperty({example: 'Исполнитель', description: 'Сценическое имя исполнителя'})
    @IsString()
    @IsNotEmpty()
    nickname: string;

    @ApiPropertyOptional({example: 'Рок', description: 'Музыкальный жанр'})
    @IsOptional()
    @IsString()
    genre?: string;

    @ApiPropertyOptional({example: 'Россия', description: 'Страна исполнителя'})
    @IsString()
    @IsOptional()
    country?: string;
    
    @ApiPropertyOptional({example: '1', description: 'ID музыкального лейбла'})
    @IsNumberString()
    @IsOptional()
    labelId?: string;
}
