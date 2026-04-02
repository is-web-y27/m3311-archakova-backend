import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Artist } from '../../artist/entities/artist.entity';
import { LabelStat } from '../../label-stat/entities/label-stat.entity';

@Entity('music_labels')
export class MusicLabel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150, unique: true })
  name: string;

  @Column({ length: 100, nullable: true })
  country: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => Artist, (artist) => artist.label)
  artists: Artist[];

  @OneToMany(() => LabelStat, (stat) => stat.label)
  stats: LabelStat[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}