import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Feedback]), UserModule],
  controllers: [FeedbackController],
  providers: [FeedbackService],
})
export class FeedbackModule {}
