import { IsNotEmpty, IsNumberString, IsOptional, IsString, MaxLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateArtistDto {
    @ApiProperty({example: 'Исполнитель', description: 'Сценическое имя исполнителя'})
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    stageName: string;

    @ApiPropertyOptional({example: 'Рок', description: 'Музыкальный жанр'})
    @IsOptional()
    @IsString()
    @MaxLength(100)
    genre?: string;

    @ApiPropertyOptional({example: 'Россия', description: 'Страна исполнителя'})
    @IsString()
    @IsOptional()
    @MaxLength(100)
    country?: string;
    
    @ApiPropertyOptional({example: '1', description: 'ID музыкального лейбла'})
    @IsNumberString({no_symbols: true})
    @IsOptional()
    labelId?: string;
}
