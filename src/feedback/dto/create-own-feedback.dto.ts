import { OmitType } from '@nestjs/swagger';
import { CreateFeedbackDto } from './create-feedback.dto';

export class CreateOwnFeedbackDto extends OmitType(CreateFeedbackDto, [
  'userId',
] as const) {}
