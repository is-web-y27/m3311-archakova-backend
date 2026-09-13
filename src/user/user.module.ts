import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserApiController } from './user-api.controller';
import { UserResolver } from './graphql/user.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController, UserApiController],
  providers: [UserService, UserResolver],
  exports: [UserService]
})
export class UserModule {}
