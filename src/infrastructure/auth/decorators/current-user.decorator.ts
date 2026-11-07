import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { AuthenticatedRequest } from '../auth-request.type';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    if (context.getType<string>() === 'graphql') {
      return GqlExecutionContext.create(context)
        .getContext<{ req: AuthenticatedRequest }>()
        .req.authUser;
    }

    return context.switchToHttp().getRequest<AuthenticatedRequest>().authUser;
  },
);
