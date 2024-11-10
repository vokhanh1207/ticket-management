import { ExecutionContext, Injectable, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    async canActivate(context: ExecutionContext) {
        try {
            const result = (await super.canActivate(context)) as boolean;
            const request = context.switchToHttp().getRequest();
            await super.logIn(request);
            return result;
        } catch (error) {
            // will be handled in controller
            return true
        }
    }
}