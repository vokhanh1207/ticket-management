import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
export declare class AuthRedirectMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction): void;
}
