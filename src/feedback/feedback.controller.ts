import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Res } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import type {Response} from 'express';
import { UserService } from 'src/user/user.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService, private readonly userService: UserService) {}

  @Get()
  @Render('feedback')
  async findAll() {
    const feedbacks =
      await this.feedbackService.findAll();

    return {feedbacks};
  }

  @Get('add')
  @Render('feedback/add')
  async showAddForm() {
    const users =
      await this.userService.findAll();

    return {users};
  }

  @Post()
  async create(
    @Body() createFeedbackDto: CreateFeedbackDto,
    @Res() res: Response,
  ) {
    const feedback = await this.feedbackService.create(createFeedbackDto);

    return res.redirect(`/feedback/${feedback.id}`);
  }

  @Get(':id/edit')
  @Render('feedback/edit')
  async showEditForm(
    @Param('id') id: string,
  ) {
    const feedback =
      await this.feedbackService.findOne(+id);

    const users =
      await this.userService.findAll();

    const userOptions =
      users.map((user) => ({
        id: user.id,
        name: user.name,
        selected:
          feedback.user.id === user.id,
      }));

    return {
      feedback,
      userOptions,
    };
  }

  @Get(':id')
  @Render('feedback/details')
  async findOne(
    @Param('id') id: string,
  ) {
    const feedback = await this.feedbackService.findOne(+id);

    return {feedback};
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
    @Res() res: Response,
  ) {
    await this.feedbackService.update(+id, updateFeedbackDto);
    return res.redirect(`/feedback/${id}`);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    await this.feedbackService.remove(+id);

    return res.redirect('/feedback');
  }
}
