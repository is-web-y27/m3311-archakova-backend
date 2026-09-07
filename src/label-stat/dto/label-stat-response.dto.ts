import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class LabelStatLabelResponseDto {
    @ApiProperty({example: 1})
    id: number;

    @ApiProperty({example: 'Mononews Records'})
    name: string;
}

export class LabelStatResponseDto {
    @ApiProperty({example: 1})
    id: number;

    @ApiProperty({type: LabelStatLabelResponseDto})
    label: LabelStatLabelResponseDto;

    @ApiProperty({example: 2026})
    year: number;

    @ApiProperty({example: '1500000.00'})
    revenue: string;

    @ApiPropertyOptional({example: '12.50', nullable: true})
    marketShare: string | null;

    @ApiProperty({example: '2026-09-07T10:00:00.000Z'})
    createdAt: Date;
}
