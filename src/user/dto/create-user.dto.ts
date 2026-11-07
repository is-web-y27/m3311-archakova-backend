import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({example: 'Иван', description: 'Имя пользователя'})
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    name: string;

    @ApiProperty({example: 'ivan@example.com', description: 'Электронная почта пользователя'})
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    email: string;

    @ApiPropertyOptional({example: 'user', description: 'Роль пользователя'})
    @IsOptional()
    @IsString()
    @MaxLength(30)
    role?: string;
}
