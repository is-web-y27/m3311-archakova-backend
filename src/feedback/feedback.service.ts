import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { Feedback } from './entities/feedback.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FeedbackService {
   constructor(
    @InjectRepository(Feedback) private readonly feedbackRepository: Repository<Feedback>, private readonly userService: UserService,) {}
  async create(createFeedbackDto: CreateFeedbackDto) {
    const { userId, rating, ...feedbackData} = createFeedbackDto;

    if (!userId) {
      throw new BadRequestException('User is required');
    }

    const user = await this.userService.findOne(Number(userId));

    const parsedRating = rating ? Number(rating) : 5;

    if (Number.isNaN(parsedRating)) {
      throw new BadRequestException('Rating must be a number');
    }

    const feedback = this.feedbackRepository.create({...feedbackData, user, rating: parsedRating});
    return this.feedbackRepository.save(feedback);
  }

  findAll() {
    return this.feedbackRepository.find({relations: {user: true}, order: {createdAt: 'DESC'}});
  }

  async findOne(id: number) {
    const feedback = await this.feedbackRepository.findOne({where: {id,}, relations: {user: true}});
    if (!feedback){
      throw new NotFoundException(`Feedback ${id} not found.`);
    }
    return feedback;
  }

  async update(id: number, updateFeedbackDto: UpdateFeedbackDto) {
    const feedback = await this.findOne(id);

    const { userId, rating, ...feedbackData} = updateFeedbackDto;
    Object.assign(feedback, feedbackData);

    if (userId !== undefined){
      if (!userId) {
        throw new BadRequestException('User is required.');
      }
      feedback.user = await this.userService.findOne(Number(userId));
    }
    if (rating !== undefined) {
      const parsedRating =
        Number(rating);

      if (Number.isNaN(parsedRating)) {
        throw new BadRequestException(
          'Rating must be a number',
        );
      }

      feedback.rating =
        parsedRating;
    }

    return this.feedbackRepository.save(
      feedback,
    );
  }

  async remove(id: number) {
    const feedback = await this.findOne(id);
    return this.feedbackRepository.remove(feedback);
  }

  async findPage( page: number, limit: number) {
    const [items, total] = await this.feedbackRepository.findAndCount({relations: {user: true}, order: {createdAt: 'DESC'}, skip: (page - 1) * limit, take: limit});

    return {items, total};
  }
}
