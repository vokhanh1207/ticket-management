import { EventsService } from './../events/events.service';
import { TicketsService } from './tickets.service';
import { Response, Request } from 'express';
export declare class TicketsController {
    private ticketsService;
    private eventsService;
    constructor(ticketsService: TicketsService, eventsService: EventsService);
    showTicket(id: string, res: Response, req: Request): Promise<void>;
    checkinTicket(id: string, res: Response, req: Request): Promise<void>;
    checkoutTicket(id: string, res: Response, req: Request): Promise<void>;
}
