import { ApiProperty } from '@nestjs/swagger';
import { ArtistResponseDto } from './artist-response.dto';

export class PaginatedArtistsResponseDto {
    @ApiProperty({type: [ArtistResponseDto]})
    items: ArtistResponseDto[];

    @ApiProperty({example: 1})
    page: number;

    @ApiProperty({example: 10})
    limit: number;

    @ApiProperty({example: 25})
    total: number;

    @ApiProperty({example: 3})
    totalPages: number;
}
