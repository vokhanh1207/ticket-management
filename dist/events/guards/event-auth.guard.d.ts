import { CanActivate, ExecutionContext } from '@nestjs/common';
import { EventsService } from '../events.service';
export declare class EventEditGuard implements CanActivate {
    private eventsService;
    constructor(eventsService: EventsService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
