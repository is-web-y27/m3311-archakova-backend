import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import type { Response } from 'express';
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const user = await this.userService.create(createUserDto);

    return res.redirect(`/users/${user.id}`)
  }

  @Get()
  @Render('users/list')
  async findAll() {
    const users = await this.userService.findAll();

    return {users};
  }

  @Get('add')
  @Render('users/add')
  addForm(){
    return {};
  }

  @Get(':id/edit')
  @Render('users/edit')
  async editForm(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);

    return {user};
  }

  @Get(':id')
  @Render('users/details')
  async findOne(@Param('id') id: string){
    const user = await this.userService.findOne(+id);

    return {user};
  }
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Res() res: Response) {
    await this.userService.update(+id, updateUserDto);

    return res.redirect(`/users/${id}`)
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.userService.remove(+id);

    return res.redirect(`/users`);
  }
}
