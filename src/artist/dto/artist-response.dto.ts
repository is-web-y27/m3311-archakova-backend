import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ArtistLabelResponseDto {
    @ApiProperty({example: 1})
    id: number;

    @ApiProperty({example: 'Mononews Records'})
    name: string;
}

export class ArtistResponseDto {
    @ApiProperty({example: 1})
    id: number;

    @ApiProperty({example: 'Исполнитель'})
    stageName: string;

    @ApiPropertyOptional({example: 'Рок', nullable: true})
    genre: string | null;

    @ApiPropertyOptional({example: 'Россия', nullable: true})
    country: string | null;

    @ApiPropertyOptional({type: ArtistLabelResponseDto, nullable: true})
    label?: ArtistLabelResponseDto | null;

    @ApiProperty({example: '2026-09-07T10:00:00.000Z'})
    createdAt: Date;

    @ApiProperty({example: '2026-09-07T10:00:00.000Z'})
    updatedAt: Date;
}
