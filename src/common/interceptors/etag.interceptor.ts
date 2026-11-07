import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import type { Request, Response } from 'express';
import { createHash } from 'node:crypto';
import { map, Observable } from 'rxjs';

@Injectable()
export class ETagInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest<Request>();
        const response = context.switchToHttp().getResponse<Response>();

        return next.handle().pipe(
            map(data => {
                if (request.method !== 'GET') {
                    return data;
                }

                const etag = this.createETag(data);

                response.setHeader('ETag', etag);

                const clientETag = request.headers['if-none-match'];

                if (clientETag === etag) {
                    response.status(304);
                    return undefined;
                }

                return data;
            }),
        );
    }

    private createETag(data: unknown): string {
        const content = JSON.stringify(data);
        const hash = createHash('sha1')
            .update(content)
            .digest('hex');

        return `"${hash}"`;
    }
}