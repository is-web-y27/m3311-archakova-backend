import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,) {}
  create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);

    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  async findAllArticlesByUser(userId: number){
    const user = await this.userRepository.findOne({where: {id: userId}, relations: {articles: true}});

    if (!user){
      throw new NotFoundException(`User ${userId} not found`);
    }

    return user.articles;
  }

  async findOneArticleByUser(userId: number, articleId: number){
    const user = await this.userRepository.findOne({where: {id: userId}, relations: {articles: true}});

    if (!user){
      throw new NotFoundException(`User ${userId} not found`);
    }

    const article = user.articles.find((article) => article.id === articleId);

    if (!article){
      throw new NotFoundException(`Article ${articleId} authored by user ${userId} not found`);
    }

    return article;
  }

  async findAllFeedbackByUser(userId: number){
    const user = await this.userRepository.findOne({where: {id: userId}, relations: {feedbacks: true}});

    if (!user){
      throw new NotFoundException(`User ${userId} not found`);
    }

    return user.feedbacks;
  }

  async findOneFeedbackByUser(userId: number, feedbackId: number){
    const user = await this.userRepository.findOne({where: {id: userId}, relations: {feedbacks: true}});

    if (!user){
      throw new NotFoundException(`User ${userId} not found`);
    }

    const feedback = user.feedbacks.find((feedback) => feedback.id === feedbackId);

    if (!feedback){
      throw new NotFoundException(`Feedback ${feedbackId} written by user ${userId} not found`);
    }

    return feedback;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({id});

    if (!user){
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);

    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    return this.userRepository.remove(user);
  }

  async findPage(page: number, limit: number){
    const [items, total] = await this.userRepository.findAndCount({order: {id: 'ASC'}, skip: (page-1)*limit, take: limit});

    return { items, total};
  }
}
