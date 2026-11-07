import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

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
  @IsString()
  @MaxLength(30)
  @Field({description: 'Роль пользователя', nullable: true})
  role?: string;
}
