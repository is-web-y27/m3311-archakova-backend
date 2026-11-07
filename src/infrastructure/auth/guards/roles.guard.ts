import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserRole } from '../../../user/entities/user-role.enum';
import type { AuthenticatedRequest } from '../auth-request.type';
import { IS_PUBLIC_KEY } from '../decorators/public-access.decorator';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles?.length) {
      return true;
    }

    const request = context.getType<string>() === 'graphql'
      ? GqlExecutionContext.create(context).getContext<{ req: AuthenticatedRequest }>().req
      : context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (!request.authUser || !roles.includes(request.authUser.role)) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }

    return true;
  }
}
