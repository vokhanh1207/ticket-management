import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserRole } from '../constants/user-role.constant';

@Injectable()
export class ScannerGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            const response = context.switchToHttp().getResponse();
            response.redirect('/login?returnUrl=' + encodeURIComponent(request.originalUrl));
            return false;
        }

        return [UserRole.ADMIN, UserRole.ORGANIZER_ADMIN, UserRole.SCANNER].includes(user.role);
    }
}
