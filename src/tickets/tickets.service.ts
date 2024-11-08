import { ConfigService } from '@nestjs/config';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as QRCode from 'qrcode';
import { Ticket } from './dto/ticket.entity';
import { TicketsRepository } from './tickets.repository';
import { TicketAction, TicketStatus } from './constants';
import { MailService } from 'src/mail/mail.service';
import { ISendMailOptions } from '@nestjs-modules/mailer';
import { Event } from 'src/events/dto/event.entity';

@Injectable()
export class TicketsService {
    constructor(
        @InjectRepository(Ticket)
        private ticketsRepository: TicketsRepository,
        private mailService: MailService,
        private configService: ConfigService
    ) { }

    async getTicketById(id: string): Promise<Ticket> {
        const found = await this.ticketsRepository.findOneBy({ id })
        if (!found) {
            throw new NotFoundException(`Ticket with ID "${id}" not found`);
        }

        return found;
    }

    async updateTicket(ticket: Ticket): Promise<Ticket> {
        await this.ticketsRepository.save(ticket);

        return ticket;
    }

    async createTicket(createTicketDto: CreateTicketDto, event: Event, host): Promise<Ticket> {
        const ticket: Ticket = this.ticketsRepository.create({
            area: createTicketDto.area,
            eventId: createTicketDto.eventId,
            seat: createTicketDto.seat,
            email: createTicketDto.email,
            status: TicketStatus.Active,
            createdAt: new Date()
        });
        const dbTicket: Ticket = await this.ticketsRepository.save(ticket);

        await QRCode.toFile(
            `${process.cwd()}/public/tickets/${event.id}/${ticket.id}.png`,
            `${host.origin}/tickets/${dbTicket.id}/on-scan`,
            {
                width: 260,
                margin: 0
            }
        );
        dbTicket.qr = `${host.origin}/tickets/${event.id}/${ticket.id}.png`;

        await this.ticketsRepository.save(dbTicket);

        const mailOptions = this.getTicketMailOptions(dbTicket, event, host)
        this.mailService.sendMail(mailOptions);
        return ticket;
    }

    async sendRemindEmail(event: Event, host): Promise<void> {
        // const eventId = event.id;

        // const mailOptions = this.getTicketMailOptions(dbTicket, event, host)
        // this.mailService.sendMail(mailOptions);
        // return ticket;
    }

    async getTicketByEventId(eventId: string): Promise<Ticket[]> {
        const tickets = this.ticketsRepository.find({ where: { eventId } })

        return tickets;
    }

    getNextAction(ticket: Ticket): TicketAction {
        let action = TicketAction.CheckIn;
        if (ticket.status === TicketStatus.CheckedIn) {
            action = TicketAction.CheckOut
        }

        return action;
    }

    private getTicketMailOptions(ticket: Ticket, event: Event, host) {
        const options: ISendMailOptions = {};
        options.from = `Ticket management <${this.configService.get('EMAIL_USERNAME')}>`
        options.to = ticket.email;
        options.subject = 'Thank you for registering our event'
        options.html = `
        <div style="max-width: 600px; font-size: 15px;">
            <div style="margin-bottom: 20px; text-align:center; font-size: 22px;">
                ${event.name}
            </div>
            <div style="margin-bottom: 10px">
                <img src="${ticket.qr}" />
            </div>
            <div style="margin-bottom: 10px">
                <b>Ticket link: </b><a href="${host.origin}/tickets/${ticket.id}">${host.origin}/tickets/${ticket.id}</a>
            </div>
            <div style="margin-bottom: 10px">
                <b>Time: </b>${event.startTime}
            </div>
            <div style="margin-bottom: 10px">
                <b>Location: </b>${event.location}
            </div>
        </div>
        `
        console.log('qr ', ticket.qr)

        return options;
    }
}
