import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import type { Response } from 'express';
import Session from 'supertokens-node/recipe/session';
import { UserService } from '../../../user/user.service';
import type { AuthenticatedRequest } from '../auth-request.type';
import { IS_PUBLIC_KEY } from '../decorators/public-access.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [
        context.getHandler(),
        context.getClass(),
      ],
    );

    const { request, response } = this.getRequestAndResponse(context);

    try {
      const session = await Session.getSession(
        request,
        response,
        {
          sessionRequired: false,
        },
      );

      if (!session) {
        if (isPublic) {
          return true;
        }

        throw new UnauthorizedException(
          'Authentication required',
        );
      }

      const authProviderId = session.getUserId();

      const user =
        await this.userService.findByAuthProviderId(
          authProviderId,
        );

      if (!user) {
        throw new UnauthorizedException(
          'Authenticated user is not linked to local user',
        );
      }

      request.session = session;
      request.authUser = user;

      if (response?.locals) {
        response.locals.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isAdmin: user.role === 'admin',
        };
      }

      return true;
    } catch (error) {
      if (isPublic) {
        return true;
      }

      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException(
        'Invalid or expired session',
      );
    }
  }

  private getRequestAndResponse(context: ExecutionContext): {
    request: AuthenticatedRequest;
    response: Response;
  } {
    if (context.getType<GqlContextType>() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context);

      const gqlRequest = gqlContext
        .getContext<{ req: AuthenticatedRequest }>()
        .req;

      return {
        request: gqlRequest,
        response: gqlRequest.res as Response,
      };
    }

    return {
      request:
        context.switchToHttp()
          .getRequest<AuthenticatedRequest>(),

      response:
        context.switchToHttp()
          .getResponse<Response>(),
    };
  }
}
