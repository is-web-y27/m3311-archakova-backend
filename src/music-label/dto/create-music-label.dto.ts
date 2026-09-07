import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateMusicLabelDto {
    @ApiProperty({example: 'Mononews Records', description: 'Название лейбла'})
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    name: string;

    @ApiPropertyOptional({example: 'Россия', description: 'Страна лейбла'})
    @IsOptional()
    @IsString()
    @MaxLength(100)
    country?: string;

    @ApiPropertyOptional({example: 'Независимый музыкальный лейбл', description: 'Описание лейбла'})
    @IsOptional()
    @IsString()
    description?: string;
}
