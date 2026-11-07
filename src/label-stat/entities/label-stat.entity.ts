import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { MusicLabel } from '../../music-label/entities/music-label.entity';

@Entity('label_stats')
export class LabelStat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MusicLabel, (label) => label.stats, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'label_id' })
  label: MusicLabel;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  revenue: string;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
    name: 'market_share',
  })
  marketShare: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
