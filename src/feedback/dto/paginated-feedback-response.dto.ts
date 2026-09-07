import { ApiProperty } from '@nestjs/swagger';
import { FeedbackResponseDto } from './feedback-response.dto';

export class PaginatedFeedbackResponseDto {
    @ApiProperty({type: [FeedbackResponseDto]})
    items: FeedbackResponseDto[];

    @ApiProperty({example: 1})
    page: number;

    @ApiProperty({example: 10})
    limit: number;

    @ApiProperty({example: 25})
    total: number;

    @ApiProperty({example: 3})
    totalPages: number;
}
