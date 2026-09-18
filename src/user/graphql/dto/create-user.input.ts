import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { UserRole } from 'src/user/entities/user-role.enum';

@InputType()
export class CreateUserInput {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Field({description: 'Имя пользователя'})
  name: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @Field({description: 'Почта пользователя'})
  email: string;

  @IsOptional()
  @IsEnum(UserRole)
  @MaxLength(30)
  @Field(() => UserRole, {description: 'Роль пользователя', nullable: true})
  role?: UserRole;
}
