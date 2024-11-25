import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './dto/event.entity';
import { EventsRepository } from './events.repository';
import { TicketsRepository } from 'src/tickets/tickets.repository';
import { Ticket } from 'src/tickets/dto/ticket.entity';
import { CreateTicketDto } from 'src/tickets/dto/create-ticket.dto';
import { TicketsService } from 'src/tickets/tickets.service';
export declare class EventsService {
    private eventsRepository;
    private ticketRepository;
    private ticketsService;
    constructor(eventsRepository: EventsRepository, ticketRepository: TicketsRepository, ticketsService: TicketsService);
    getEventById(id: string): Promise<Event>;
    getTicketsByEventId(eventId: string): Promise<Ticket[]>;
    getEvents(): Promise<Event[]>;
    createEvent(createEventDto: CreateEventDto, username: string): Promise<Event>;
    updateEvent(eventId: string, createEventDto: CreateEventDto): Promise<Event>;
    regisiterEvent(createTicketDto: CreateTicketDto, host: any): Promise<Ticket>;
    sendRemindEmails(eventId: string, header: any): Promise<boolean>;
}