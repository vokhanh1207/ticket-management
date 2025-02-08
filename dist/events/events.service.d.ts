import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './dto/event.entity';
import { EventsRepository } from './events.repository';
import { TicketsRepository } from 'src/tickets/tickets.repository';
import { Ticket } from 'src/tickets/dto/ticket.entity';
import { CreateTicketDto } from 'src/tickets/dto/create-ticket.dto';
import { TicketsService } from 'src/tickets/tickets.service';
import { UpdateEventDto } from './dto/update-event.dto';
export declare class EventsService {
    private eventsRepository;
    private ticketRepository;
    private ticketsService;
    constructor(eventsRepository: EventsRepository, ticketRepository: TicketsRepository, ticketsService: TicketsService);
    getEventById(id: string): Promise<Event>;
    getTicketsByEventId(eventId: string): Promise<Ticket[]>;
    getEvents(): Promise<Event[]>;
    createEvent(createEventDto: CreateEventDto, username: string, origin: string): Promise<Event>;
    updateEvent(eventId: string, updateEventDto: UpdateEventDto): Promise<Event>;
    regisiterEvent(createTicketDto: CreateTicketDto, origin: string): Promise<Ticket>;
    sendRemindEmails(eventId: string, origin: string): Promise<boolean>;
    updateBanner(eventId: string, bannerImage: string): Promise<Event>;
}
