import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { EventsService } from '../events.service';
import { UserRole } from 'src/auth/constants/user-role.constant';

@Injectable()
export class EventEditGuard implements CanActivate {
    constructor(private eventsService: EventsService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const eventId = request.params.eventId;

        if (!user) return false;
        
        // SCANNER role cannot edit
        if (user.role === UserRole.SCANNER) return false;
        
        // ADMIN can edit all events
        if (user.role === UserRole.ADMIN) return true;
        
        // For ORGANIZER_ADMIN, check if they own the event
        if (user.role === UserRole.ORGANIZER_ADMIN) {
            const event = await this.eventsService.getEventById(eventId);
            return user.organizerId === event.organizerId;
        }

        return false;
    }
}
