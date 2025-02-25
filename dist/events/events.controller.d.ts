/// <reference types="multer" />
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { Response, Request as ExpressRequest } from 'express';
import { CreateTicketDto } from 'src/tickets/dto/create-ticket.dto';
import { OrganizersService } from 'src/organizers/organizers.service';
import { User } from 'src/auth/user.entity';
import { MailSchedulesService } from 'src/mail-schedules/mail-schedules.service';
import { EventFileService } from './services/event-file.service';
interface RequestWithUser extends ExpressRequest {
    user?: User;
}
export declare class EventsController {
    private eventsService;
    private organizersService;
    private mailSchedulesService;
    private eventFileService;
    constructor(eventsService: EventsService, organizersService: OrganizersService, mailSchedulesService: MailSchedulesService, eventFileService: EventFileService);
    showEvents(res: Response, req: RequestWithUser): Promise<void>;
    showNewEvents(res: Response, req: RequestWithUser): Promise<void>;
    createNewEvents(createEventDto: CreateEventDto, res: Response, req: RequestWithUser, headers: any): Promise<void | Response<any, Record<string, any>>>;
    getEvent(res: Response, req: RequestWithUser): Promise<void>;
    registerEvent(createTicketDto: CreateTicketDto, req: RequestWithUser, res: Response, headers: any): Promise<void>;
    showEditEvent(res: Response, req: RequestWithUser): Promise<void>;
    editEvent(res: Response, req: RequestWithUser, createEventDto: CreateEventDto): Promise<void | Response<any, Record<string, any>>>;
    getEventTickets(res: Response, req: RequestWithUser): Promise<void>;
    remindTickets(eventId: string, req: RequestWithUser): Promise<boolean>;
    uploadBanner(eventId: string, file: Express.Multer.File): Promise<{
        message: string;
        event?: undefined;
    } | {
        message: string;
        event: import("./dto/event.entity").Event;
    }>;
}
export {};
