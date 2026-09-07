import { IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateLabelStatDto {

    @ApiProperty({example: '1', description: 'ID музыкального лейбла'})
    @IsNumberString()
    @IsNotEmpty()
    labelId: string;

    @ApiProperty({example: '2026', description: 'Год статистики'})
    @IsNotEmpty()
    @IsString()
    year: string;

    @ApiProperty({example: '1500000.00', description: 'Доход лейбла'})
    @IsString()
    @IsNotEmpty()
    income: string;

    @ApiPropertyOptional({example: '12.50', description: 'Доля рынка в процентах'})
    @IsOptional()
    @IsString()
    marketShare?: string;
}
