import { ApiProperty } from '@nestjs/swagger';

class FeedbackUserResponseDto {
    @ApiProperty({example: 1})
    id: number;

    @ApiProperty({example: 'Иван'})
    name: string;
}

export class FeedbackResponseDto {
    @ApiProperty({example: 1})
    id: number;

    @ApiProperty({type: FeedbackUserResponseDto})
    user: FeedbackUserResponseDto;

    @ApiProperty({example: 'Отличный сайт!'})
    message: string;

    @ApiProperty({example: 5})
    rating: number;

    @ApiProperty({example: '2026-09-07T10:00:00.000Z'})
    createdAt: Date;
}
