import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { parse } from 'pg-connection-string';

import { User } from './user/entities/user.entity';
import { Artist } from './artist/entities/artist.entity';
import { MusicLabel } from './music-label/entities/music-label.entity';
import { Article } from './article/entities/article.entity';
import { Feedback } from './feedback/entities/feedback.entity';
import { LabelStat } from './label-stat/entities/label-stat.entity';

console.log('data-source loaded');

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set');
}

const parsed = parse(databaseUrl);

export default new DataSource({
  type: 'postgres',
  host: parsed.host ?? '',
  port: parsed.port ? Number(parsed.port) : 5432,
  username: parsed.user,
  password: parsed.password,
  database: parsed.database ?? '',
  entities: [User, Artist, MusicLabel, Article, Feedback, LabelStat],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  ssl: {
    rejectUnauthorized: false,
  },
  extra: {
    connectionTimeoutMillis: 10000,
  },
});
