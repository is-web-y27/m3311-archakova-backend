import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { middleware } from 'supertokens-node/framework/express';
import { SuperTokensService } from '../supertokens.service';

@Injectable()
export class SuperTokensMiddleware implements NestMiddleware {
  private readonly handler;

  constructor(
    private readonly superTokensService: SuperTokensService,
  ) {
    this.handler = middleware();
  }

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.handler(req, res, next);
  }
}