import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { Response, Request } from 'express';
import { CreateTicketDto } from 'src/tickets/dto/create-ticket.dto';
export declare class EventsController {
    private eventsService;
    constructor(eventsService: EventsService);
    showEvents(res: Response, req: Request): Promise<void>;
    showNewEvents(res: Response, req: Request): void;
    createNewEvents(createEventDto: CreateEventDto, res: Response, req: Request): Promise<void>;
    getEvent(res: Response, req: Request): Promise<void>;
    registerEvent(createTicketDto: CreateTicketDto, req: Request, res: Response, headers: any): Promise<void>;
    showEditEvent(res: Response, req: Request): Promise<void>;
    editEvent(res: Response, req: Request, createEventDto: CreateEventDto): Promise<void>;
    getEventTickets(res: Response, req: Request): Promise<void>;
    remindTickets(eventId: string, headers: any): Promise<boolean>;
}
