import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MusicLabelResponseDto {
    @ApiProperty({example: 1})
    id: number;

    @ApiProperty({example: 'Mononews Records'})
    name: string;

    @ApiPropertyOptional({example: 'Россия', nullable: true})
    country: string | null;

    @ApiPropertyOptional({example: 'Независимый музыкальный лейбл', nullable: true})
    description: string | null;

    @ApiProperty({example: '2026-09-07T10:00:00.000Z'})
    createdAt: Date;

    @ApiProperty({example: '2026-09-07T10:00:00.000Z'})
    updatedAt: Date;
}
