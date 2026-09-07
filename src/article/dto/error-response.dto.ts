import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: 404 })
  statusCode: number;

  @ApiProperty({
    example: 'Resource not found.',
  })
  message: string | string[];

  @ApiProperty({
    example: '/api/resources/999',
  })
  path: string;

  @ApiProperty({
    example: '2026-09-07T10:00:00.000Z',
  })
  timestamp: string;
}
