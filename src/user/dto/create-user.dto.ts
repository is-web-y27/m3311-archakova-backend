import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({example: 'Иван', description: 'Имя пользователя'})
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({example: 'ivan@example.com', description: 'Электронная почта пользователя'})
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiPropertyOptional({example: 'user', description: 'Роль пользователя'})
    @IsOptional()
    @IsString()
    role?: string;
}
