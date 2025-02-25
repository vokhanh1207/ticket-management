import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthRedirectMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        if (!req.user && !req.path.includes('/login')) {
            return res.redirect('/login?returnUrl=' + encodeURIComponent(req.originalUrl));
        }
        next();
    }
}
