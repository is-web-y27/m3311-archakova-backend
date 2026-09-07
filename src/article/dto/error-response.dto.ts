import { ApiProperty } from '@nestjs/swagger';

export class BadRequestResponseDto {
  @ApiProperty({example: 400})
  statusCode: number;

  @ApiProperty({oneOf: [{type: 'string'}, {type: 'array', items: {type: 'string'}}], example: ['field must be valid']})
  message: string | string[];

  @ApiProperty({example: '/api/resources'})
  path: string;

  @ApiProperty({example: '2026-09-07T10:00:00.000Z'})
  timestamp: string;
}

export class NotFoundResponseDto {
  @ApiProperty({example: 404})
  statusCode: number;

  @ApiProperty({example: 'Resource not found.'})
  message: string;

  @ApiProperty({example: '/api/resources/999'})
  path: string;

  @ApiProperty({example: '2026-09-07T10:00:00.000Z'})
  timestamp: string;
}

export class ConflictResponseDto {
  @ApiProperty({example: 409})
  statusCode: number;

  @ApiProperty({example: 'Resource with these unique features already exists.'})
  message: string;

  @ApiProperty({example: '/api/resources'})
  path: string;

  @ApiProperty({example: '2026-09-07T10:00:00.000Z'})
  timestamp: string;
}
