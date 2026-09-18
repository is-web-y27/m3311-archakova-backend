import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeormConfService } from './infrastructure/database/typeorm_conf.service';
import { MusicLabelModule } from './music-label/music-label.module';
import { UserModule } from './user/user.module';
import { ArtistModule } from './artist/artist.module';
import { LabelStatModule } from './label-stat/label-stat.module';
import { FeedbackModule } from './feedback/feedback.module';
import { ArticleModule } from './article/article.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { complexityPlugin } from './common/graphql/complexity.plugin';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ElapsedTimeInterceptor } from './common/interceptors/elapsed-time.interceptor';
import { AuthModule } from './infrastructure/auth/auth.module';

function getRequiredEnv(name: string): string{
  const value = process.env[name];
  if (!value){
    throw new Error(`There is no ${name}`);
  }
  return value;
}
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    AuthModule.forRoot({
      connectionURI: getRequiredEnv('SUPERTOKENS_CONNECTION_URI'),
      apiKey: getRequiredEnv('SUPERTOKENS_API_KEY'),
      appName: 'Mononews',
      apiDomain: getRequiredEnv('APP_API_DOMAIN'),
      websiteDomain: getRequiredEnv('APP_WEBSITE_DOMAIN'),
      adminEmails: (process.env.AUTH_ADMIN_EMAILS ?? '')
        .split(',')
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault(), complexityPlugin()],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeormConfService,
    }),
    MusicLabelModule,
    UserModule,
    ArtistModule,
    LabelStatModule,
    FeedbackModule,
    ArticleModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_INTERCEPTOR, useClass: ElapsedTimeInterceptor}],
})
export class AppModule {}
