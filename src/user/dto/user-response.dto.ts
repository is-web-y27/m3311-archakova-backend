import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
    @ApiProperty({example: 1})
    id: number;

    @ApiProperty({example: 'Иван'})
    name: string;

    @ApiProperty({example: 'ivan@example.com'})
    email: string;

    @ApiProperty({example: 'user'})
    role: string;

    @ApiProperty({example: '2026-09-07T10:00:00.000Z'})
    createdAt: Date;

    @ApiProperty({example: '2026-09-07T10:00:00.000Z'})
    updatedAt: Date;
}
