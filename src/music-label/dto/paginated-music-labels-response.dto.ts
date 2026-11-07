import { ApiProperty } from '@nestjs/swagger';
import { MusicLabelResponseDto } from './music-label-response.dto';

export class PaginatedMusicLabelsResponseDto {
    @ApiProperty({type: [MusicLabelResponseDto]})
    items: MusicLabelResponseDto[];

    @ApiProperty({example: 1})
    page: number;

    @ApiProperty({example: 10})
    limit: number;

    @ApiProperty({example: 25})
    total: number;

    @ApiProperty({example: 3})
    totalPages: number;
}
