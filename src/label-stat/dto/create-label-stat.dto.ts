import { IsNotEmpty, IsNumberString, IsOptional, Matches } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateLabelStatDto {

    @ApiProperty({example: '1', description: 'ID музыкального лейбла'})
    @IsNumberString({no_symbols: true})
    @IsNotEmpty()
    labelId: string;

    @ApiProperty({example: '2026', description: 'Год статистики'})
    @IsNotEmpty()
    @IsNumberString()
    @Matches(/^\d{4}$/)
    year: string;

    @ApiProperty({example: '1500000.00', description: 'Доход лейбла'})
    @IsNumberString()
    @IsNotEmpty()
    @Matches(/^\d{1,13}(\.\d{1,2})?$/)
    revenue: string;

    @ApiPropertyOptional({example: '12.50', description: 'Доля рынка в процентах'})
    @IsOptional()
    @IsNumberString()
    @Matches(/^(100(\.0{1,2})?|\d{1,2}(\.\d{1,2})?)$/)
    marketShare?: string;
}
