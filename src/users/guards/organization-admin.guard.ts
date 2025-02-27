import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserRole } from '../../auth/constants/user-role.constant';

@Injectable()
export class OrganizationAdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            // throw new ForbiddenException('Not authenticated');
            return false;
        }

        if (user.role !== UserRole.ADMIN && user.role !== UserRole.ORGANIZER_ADMIN) {
            // throw new ForbiddenException('Insufficient permissions');
            return false;
        }

        return true;
    }
}
