import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateMusicLabelDto {
    @ApiProperty({example: 'Mononews Records', description: 'Название лейбла'})
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({example: 'Россия', description: 'Страна лейбла'})
    @IsOptional()
    @IsString()
    country?: string;

    @ApiPropertyOptional({example: 'Независимый музыкальный лейбл', description: 'Описание лейбла'})
    @IsOptional()
    @IsString()
    description?: string;
}
