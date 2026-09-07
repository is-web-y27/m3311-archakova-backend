import { IsIn, IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateFeedbackDto {
    @ApiProperty({example: '1', description: 'ID пользователя'})
    @IsNumberString()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({example: 'Отличный сайт!', description: 'Текст отзыва'})
    @IsNotEmpty()
    @IsString()
    message: string;

    @ApiPropertyOptional({example: '5', description: 'Оценка'})
    @IsOptional()
    @IsNumberString({no_symbols: true})
    @IsIn(['1', '2', '3', '4', '5'])
    rating?: string;
}
