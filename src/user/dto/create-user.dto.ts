import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { UserRole } from "../entities/user-role.enum";

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
    @IsEnum(UserRole)
    @MaxLength(30)
    role?: UserRole;
}
