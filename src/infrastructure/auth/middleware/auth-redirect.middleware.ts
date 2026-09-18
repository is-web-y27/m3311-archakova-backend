import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import Session from 'supertokens-node/recipe/session';

@Injectable()
export class AuthRedirectMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!this.isProtectedPage(req) || !req.accepts('html')) {
      next();
      return;
    }

    try {
      const session = await Session.getSession(req, res, { sessionRequired: false });

      if (!session) {
        this.redirectToLogin(req, res);
        return;
      }
    } catch {
      this.redirectToLogin(req, res);
      return;
    }

    next();
  }

  private redirectToLogin(req: Request, res: Response): void {
    const returnTo = encodeURIComponent(req.originalUrl);
    res.redirect(`/login?returnTo=${returnTo}`);
  }

  private isProtectedPage(req: Request): boolean {
    if (req.path.startsWith('/api/') || req.path.startsWith('/auth') || req.path === '/graphql') {
      return false;
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return true;
    }

    return [
      /^\/profile(?:\/|$)/,
      /^\/users(?:\/|$)/,
      /^\/artists(?:\/|$)/,
      /^\/music-labels(?:\/|$)/,
      /^\/label-stats(?:\/|$)/,
      /^\/articles$/,
      /^\/articles\/add$/,
      /^\/articles\/\d+\/edit$/,
      /^\/feedback\/add$/,
      /^\/feedback\/\d+\/edit$/,
    ].some((pattern) => pattern.test(req.path));
  }
}
