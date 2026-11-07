import { ApiProperty } from '@nestjs/swagger';
import { LabelStatResponseDto } from './label-stat-response.dto';

export class PaginatedLabelStatsResponseDto {
    @ApiProperty({type: [LabelStatResponseDto]})
    items: LabelStatResponseDto[];

    @ApiProperty({example: 1})
    page: number;

    @ApiProperty({example: 10})
    limit: number;

    @ApiProperty({example: 25})
    total: number;

    @ApiProperty({example: 3})
    totalPages: number;
}
