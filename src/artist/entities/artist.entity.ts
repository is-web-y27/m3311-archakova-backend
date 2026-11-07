import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { MusicLabel } from '../../music-label/entities/music-label.entity';
import { Article } from '../../article/entities/article.entity';

@Entity('artists')
export class Artist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  stageName: string;

  @Column({ length: 100, nullable: true })
  genre: string;

  @Column({ length: 100, nullable: true })
  country: string;

  @ManyToOne(() => MusicLabel, (label) => label.artists, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'label_id' })
  label: MusicLabel | null;

  @OneToMany(() => Article, (article) => article.artist)
  articles: Article[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
