import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { UserModule } from 'src/user/user.module';
import { FeedbackApiController } from './feedback-api.controller';
import { FeedbackResolver } from './graphql/feedback.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Feedback]), UserModule],
  controllers: [FeedbackController, FeedbackApiController],
  providers: [FeedbackService, FeedbackResolver],
})
export class FeedbackModule {}
