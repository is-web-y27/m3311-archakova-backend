import { PartialType } from '@nestjs/swagger';
import { CreateLabelStatDto } from './create-label-stat.dto';

export class UpdateLabelStatDto extends PartialType(CreateLabelStatDto) {}
