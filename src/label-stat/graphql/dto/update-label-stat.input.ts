import { InputType, PartialType } from '@nestjs/graphql';
import { CreateLabelStatInput } from './create-label-stat.input';

@InputType()
export class UpdateLabelStatInput extends PartialType(CreateLabelStatInput) {}
