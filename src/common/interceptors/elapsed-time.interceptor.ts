import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";
import { finalize, map, Observable, tap } from "rxjs";
import type { Request, Response } from 'express';
import { Reflector } from "@nestjs/core";
import { RENDER_METADATA } from "@nestjs/common/constants";
@Injectable()
export class ElapsedTimeInterceptor implements NestInterceptor{
    private readonly logger = new Logger(ElapsedTimeInterceptor.name);

    constructor(private readonly reflector: Reflector){}
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const startedAt = performance.now();
        return next.handle().pipe(map( data => {
            const elapsed = performance.now() - startedAt;
            const value =  `${Math.round(elapsed)}ms`;

            if (this.isRenderedPage(context) && data && typeof data === "object"){
                return { ...data, elapsedTime: value};
            }
            this.setElapsedHeader(context, elapsed);
            return data;

        }), finalize(()=> {
            const elapsed = performance.now()-startedAt;
            this.logger.log(`Elapsed time: ${Math.round(elapsed)} ms`);
        }))
    }

    private isRenderedPage(context: ExecutionContext): boolean {
        if (context.getType<GqlContextType>() === "graphql"){
            return false;
        }

        const template = this.reflector.get<string>(RENDER_METADATA, context.getHandler());

        return !!template;
    }
    private setElapsedHeader(context: ExecutionContext, elapsed: number): void {
        const value = `${Math.round(elapsed)}ms`;
        if (context.getType<GqlContextType>() === 'graphql'){
            const gqlContext = GqlExecutionContext.create(context);
            const request = gqlContext.getContext<{req: Request }>().req;

            request.res?.setHeader('X-Elapsed-Time', value);
            return;
        }

        const request = context.switchToHttp().getRequest<Request>();
        if (request.headers.accept?.includes('text/event-stream')){
            return;
        }

        const response = context.switchToHttp().getResponse<Response>();
        response.setHeader('X-Elapsed-Time', value);
    }

}

