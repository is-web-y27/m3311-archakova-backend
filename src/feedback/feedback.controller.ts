import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Res } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import type {Response} from 'express';
import { UserService } from 'src/user/user.service';
import { PublicAccess } from 'src/infrastructure/auth/decorators/public-access.decorator';
import { Roles } from 'src/infrastructure/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/infrastructure/auth/decorators/current-user.decorator';
import { UserRole } from 'src/user/entities/user-role.enum';
import { User } from 'src/user/entities/user.entity';
import { assertOwnerOrAdmin } from 'src/infrastructure/auth/resource-access';

@Roles(UserRole.USER, UserRole.ADMIN)
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService, private readonly userService: UserService) {}

  @Get()
  @PublicAccess()
  @Render('feedback')
  async findAll() {
    const feedbacks =
      await this.feedbackService.findAll();

    return {feedbacks};
  }

  @Get('add')
  @Roles(UserRole.USER, UserRole.ADMIN)
  @Render('feedback/add')
  showAddForm(@CurrentUser() user: User) {
    return { user };
  }

  @Post()
  @Roles(UserRole.USER, UserRole.ADMIN)
  async create(
    @Body() createFeedbackDto: CreateFeedbackDto,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    const feedback = await this.feedbackService.create({
      ...createFeedbackDto,
      userId: String(user.id),
    });

    return res.redirect(`/feedback/${feedback.id}`);
  }

  @Get(':id/edit')
  @Render('feedback/edit')
  async showEditForm(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    const feedback =
      await this.feedbackService.findOne(+id);

    assertOwnerOrAdmin(user, feedback.user.id);

    const isAdmin = user.role === UserRole.ADMIN;
    const users = isAdmin
      ? await this.userService.findAll()
      : [user];

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
      isAdmin,
    };
  }

  @Get(':id')
  @PublicAccess()
  @Render('feedback/details')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user?: User,
  ) {
    const feedback = await this.feedbackService.findOne(+id);

    return {
      feedback,
      canManage: Boolean(user && (
        user.role === UserRole.ADMIN || feedback.user.id === user.id
      )),
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    const feedback = await this.feedbackService.findOne(+id);
    assertOwnerOrAdmin(user, feedback.user.id);

    await this.feedbackService.update(+id, {
      ...updateFeedbackDto,
      userId: user.role === UserRole.ADMIN
        ? updateFeedbackDto.userId
        : String(user.id),
    });
    return res.redirect(`/feedback/${id}`);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    const feedback = await this.feedbackService.findOne(+id);
    assertOwnerOrAdmin(user, feedback.user.id);

    await this.feedbackService.remove(+id);

    return res.redirect('/feedback');
  }
}
