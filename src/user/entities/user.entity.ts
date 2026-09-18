import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Article } from '../../article/entities/article.entity';
import { Feedback } from '../../feedback/entities/feedback.entity';
import { UserRole } from './user-role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Column({ type: 'varchar', default: UserRole.USER, length: 30 })
  role: UserRole;
  
  @Column({
    name: 'auth_provider_id',
    type: 'varchar',
    length: 128,
    nullable: true,
    unique: true,
  })
  authProviderId: string | null;
  
  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];

  @OneToMany(() => Feedback, (feedback) => feedback.user)
  feedbacks: Feedback[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
