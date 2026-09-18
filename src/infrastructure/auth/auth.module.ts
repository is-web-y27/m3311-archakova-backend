import { DynamicModule, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AUTH_MODULE_OPTIONS } from './auth.constants';
import { AuthModuleOptions } from './auth.types';
import { SuperTokensService } from './supertokens.service';
import { SuperTokensMiddleware } from './middleware/supertokens.middleware';
import { UserModule } from 'src/user/user.module';
import { AuthGuard } from './guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { AuthRedirectMiddleware } from './middleware/auth-redirect.middleware';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
})
export class AuthModule implements NestModule {
  static forRoot(options: AuthModuleOptions): DynamicModule {
    return {
      module: AuthModule,
      imports: [UserModule],
      providers: [{
        provide: AUTH_MODULE_OPTIONS, useValue: options},
        SuperTokensService, SuperTokensMiddleware, AuthRedirectMiddleware, AuthGuard, RolesGuard, {
            provide: APP_GUARD, useExisting: AuthGuard
        }, {
            provide: APP_GUARD, useExisting: RolesGuard
        }
      ],

      exports: [SuperTokensService]
    };
  }

  configure(consumer: MiddlewareConsumer) {
      consumer.apply(SuperTokensMiddleware, AuthRedirectMiddleware).forRoutes({path: '{*splat}', method: RequestMethod.ALL});
  }
}
