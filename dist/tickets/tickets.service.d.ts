import { ConfigService } from '@nestjs/config';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Ticket } from './dto/ticket.entity';
import { TicketsRepository } from './tickets.repository';
import { MailService } from 'src/mail/mail.service';
import { Event } from 'src/events/dto/event.entity';
export declare class TicketsService {
    private ticketsRepository;
    private mailService;
    private configService;
    constructor(ticketsRepository: TicketsRepository, mailService: MailService, configService: ConfigService);
    getTicketById(id: string): Promise<Ticket>;
    updateTicket(ticketId: string, updatedTicket: CreateTicketDto | Ticket): Promise<Ticket>;
    createTicket(createTicketDto: CreateTicketDto, event: Event, origin: string): Promise<Ticket>;
    sendRemindEmails(event: Event, origin: string): Promise<boolean>;
    getTicketsByEventId(eventId: string): Promise<Ticket[]>;
    validateRegisterEmail(eventId: string, email: string): Promise<boolean>;
    private getTicketMailOptions;
    private getRemindMailOptions;
}
