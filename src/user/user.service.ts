import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRole } from './entities/user-role.enum';
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

  async findByAuthProviderId(authProviderId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { authProviderId },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async updateProfile(id: number, name: string): Promise<User> {
    const user = await this.findOne(id);
    user.name = name.trim();

    return this.userRepository.save(user);
  }

  async linkOrCreateAuthUser(
    authProviderId: string,
    email: string,
    name: string,
    role = UserRole.USER,
  ): Promise<User> {
    const userByAuthId = await this.findByAuthProviderId(authProviderId);

    if (userByAuthId) {
      if (role === UserRole.ADMIN && userByAuthId.role !== UserRole.ADMIN) {
        userByAuthId.role = UserRole.ADMIN;
        return this.userRepository.save(userByAuthId);
      }

      return userByAuthId;
    }

    const userByEmail = await this.findByEmail(email);

    if (userByEmail) {
      if (userByEmail.authProviderId && userByEmail.authProviderId !== authProviderId) {
        throw new ConflictException('User with this email is already linked to another authentication account');
      }
      userByEmail.authProviderId = authProviderId;
      if (role === UserRole.ADMIN) {
        userByEmail.role = UserRole.ADMIN;
      }
      return this.userRepository.save(userByEmail);
    }

    const user = this.userRepository.create({
      name,
      email,
      role,
      authProviderId,
    });

    return this.userRepository.save(user);
  }
}
