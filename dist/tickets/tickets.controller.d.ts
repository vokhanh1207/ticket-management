import { EventsService } from './../events/events.service';
import { TicketsService } from './tickets.service';
import { Response, Request } from 'express';
import { CreateTicketDto } from './dto/create-ticket.dto';
export declare class TicketsController {
    private ticketsService;
    private eventsService;
    constructor(ticketsService: TicketsService, eventsService: EventsService);
    showTicket(id: string, res: Response, req: Request): Promise<void>;
    showEditTicket(id: string, res: Response, req: Request): Promise<void>;
    editTicket(id: string, res: Response, req: Request, createTicketDto: CreateTicketDto): Promise<void>;
    checkinTicket(id: string, res: Response, req: Request): Promise<void>;
    onScanTicket(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    checkinTicketApi(id: string, res: Response, req: Request): Promise<Response<any, Record<string, any>>>;
    checkoutTicket(id: string, res: Response, req: Request): Promise<void>;
}
