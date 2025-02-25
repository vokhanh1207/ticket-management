import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserRole } from '../../auth/constants/user-role.constant';

@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const user = request.user;

        // Check for authenticated admin user
        if (!user || user.role !== UserRole.ADMIN) {
            if (!response.headersSent) {
                response.render('forbidden');
            }
            return false;
        }

        return true;
    }
}
