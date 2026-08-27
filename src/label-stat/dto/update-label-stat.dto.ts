import { PartialType } from '@nestjs/mapped-types';
import { CreateLabelStatDto } from './create-label-stat.dto';

export class UpdateLabelStatDto extends PartialType(CreateLabelStatDto) {}
