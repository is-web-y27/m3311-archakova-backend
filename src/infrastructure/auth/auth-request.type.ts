import type { Request } from 'express';
import type { SessionContainer } from 'supertokens-node/recipe/session';
import type { User } from '../../user/entities/user.entity';

export type AuthenticatedRequest = Request & {
  authUser?: User;
  session?: SessionContainer;
};
