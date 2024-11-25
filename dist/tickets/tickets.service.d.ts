import { ConfigService } from '@nestjs/config';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Ticket } from './dto/ticket.entity';
import { TicketsRepository } from './tickets.repository';
import { TicketAction } from './constants';
import { MailService } from 'src/mail/mail.service';
import { Event } from 'src/events/dto/event.entity';
export declare class TicketsService {
    private ticketsRepository;
    private mailService;
    private configService;
    constructor(ticketsRepository: TicketsRepository, mailService: MailService, configService: ConfigService);
    getTicketById(id: string): Promise<Ticket>;
    updateTicket(ticket: Ticket): Promise<Ticket>;
    createTicket(createTicketDto: CreateTicketDto, event: Event, host: any): Promise<Ticket>;
    sendRemindEmails(event: Event, host: any): Promise<boolean>;
    getTicketsByEventId(eventId: string): Promise<Ticket[]>;
    validateRegisterEmail(eventId: string, email: string): Promise<boolean>;
    getNextAction(ticket: Ticket): TicketAction;
    private getTicketMailOptions;
    private getRemindMailOptions;
}
