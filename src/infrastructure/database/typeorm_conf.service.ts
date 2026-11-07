import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { parse } from 'pg-connection-string';

import { User } from '../../user/entities/user.entity';
import { Artist } from '../../artist/entities/artist.entity';
import { MusicLabel } from '../../music-label/entities/music-label.entity';
import { Article } from '../../article/entities/article.entity';
import { Feedback } from '../../feedback/entities/feedback.entity';
import { LabelStat } from '../../label-stat/entities/label-stat.entity';

@Injectable()
export class TypeormConfService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const databaseUrl = this.configService.get<string>('DATABASE_URL');

    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not set');
    }

    const parsed = parse(databaseUrl);

    return {
      type: 'postgres',
      host: parsed.host ?? '',
      port: parsed.port ? Number(parsed.port) : 5432,
      username: parsed.user,
      password: parsed.password,
      database: parsed.database ?? '',
      entities: [User, Artist, MusicLabel, Article, Feedback, LabelStat],
      synchronize: false,
      ssl: {
        rejectUnauthorized: false,
      },
    };
  }
}
