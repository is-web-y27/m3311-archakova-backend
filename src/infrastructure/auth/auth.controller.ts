import { Body, Controller, Get, Patch, Post, Query, Render, Req, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiCookieAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { User } from '../../user/entities/user.entity';
import { UserService } from '../../user/user.service';
import type { AuthenticatedRequest } from './auth-request.type';
import { CurrentUser } from './decorators/current-user.decorator';
import { PublicAccess } from './decorators/public-access.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller()
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @PublicAccess()
  @Get('login')
  @Render('auth/login')
  showLogin(@Query('returnTo') returnTo = '/') {
    return { returnTo: this.getSafeReturnTo(returnTo) };
  }

  @PublicAccess()
  @Get('register')
  @Render('auth/register')
  showRegister() {
    return {};
  }

  @Get('profile')
  @Render('auth/profile')
  showProfile(@CurrentUser() user: User) {
    return { profile: user };
  }

  @Patch('profile')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
  async updateProfile(
    @CurrentUser() user: User,
    @Body() updateProfileDto: UpdateProfileDto,
    @Res() response: Response,
  ) {
    await this.userService.updateProfile(user.id, updateProfileDto.name);
    return response.redirect('/profile');
  }

  @Post('logout')
  async logout(
    @Req() request: AuthenticatedRequest,
    @Res() response: Response,
  ) {
    await request.session?.revokeSession();
    return response.redirect('/');
  }

  @ApiTags('Auth')
  @ApiCookieAuth('supertokens')
  @ApiOperation({ summary: 'Получить текущего пользователя' })
  @ApiOkResponse({ description: 'Текущий пользователь' })
  @Get('api/auth/me')
  getCurrentUser(@CurrentUser() user: User) {
    return user;
  }

  private getSafeReturnTo(returnTo: string): string {
    return returnTo.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/';
  }
}
