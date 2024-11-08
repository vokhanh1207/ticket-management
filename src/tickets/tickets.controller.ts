import { EventsService } from './../events/events.service';
import { Body, Controller, Get, Param, Post, Req, Res, Headers } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Ticket } from './dto/ticket.entity';
import { Event } from 'src/events/dto/event.entity';
import { Response, Request } from 'express';
import { TicketStatus } from './constants';

@Controller('tickets')
export class TicketsController {

    constructor(
        private ticketsService: TicketsService,
        private eventsService: EventsService
    ) { }

    @Get('/:id')
    async showTicket(@Param('id') id: string, @Res() res: Response, @Req() req: Request) {
        const ticket = await this.ticketsService.getTicketById(id);
        let event: Event;
        if (ticket) {
            event = await this.eventsService.getEventById(ticket.eventId)
        }
        const action = this.ticketsService.getNextAction(ticket);

        // if admin and action == update => update checkin time
        return res.render('ticket-details', { event, ticket, action, user: req.user })
    }

    @Get('/:id/on-scan')
    async checkinTicket(
        @Param('id') id: string,
        @Res() res: Response,
        @Req() req: Request,
    ) {
        if (!req.user) {
            return res.redirect(`/tickets/${id}`);
        }
        let ticket = await this.ticketsService.getTicketById(id);
        let message: string;

        // if admin and action == update => update checkin time
        if (ticket.status === TicketStatus.Used) {
            message = `The ticket is already used.`;
        } else if (ticket.status === TicketStatus.Expired) {
            message = `The ticket is expired.`;
        } else if (ticket.status === TicketStatus.CheckedIn) {
            ticket.status = TicketStatus.Used;
            ticket = await this.ticketsService.updateTicket(ticket);
            message = `Checked out.`;
        } else {
            ticket.status = TicketStatus.CheckedIn;
            ticket = await this.ticketsService.updateTicket(ticket);
            message = `Verified!`;
        }

        const action = this.ticketsService.getNextAction(ticket);
        const event = await this.eventsService.getEventById(ticket.eventId);
        return res.render('ticket-details', { 
            ticket,
            message,
            action,
            event,
            user: req.user
        })
    }

    @Get('/:id/check-out')
    async checkoutTicket(
        @Param('id') id: string,
        @Res() res: Response,
        @Req() req: Request
    ) {
        if (!req.user) {
            return res.redirect(`/tickets/${id}`);
        }
        let ticket = await this.ticketsService.getTicketById(id);
        let message: string;

        // if admin and action == update => update checkin time
        if (ticket.status === TicketStatus.CheckedIn ) {
            message = `The ticket is already used.`;
        } else if (ticket.status === TicketStatus.Expired) {
            message = `The ticket is expired.`;
        } else {
            ticket.status = TicketStatus.CheckedIn;
            ticket = await this.ticketsService.updateTicket(ticket);
            message = `Verified!`;
        }

        const action = this.ticketsService.getNextAction(ticket);

        return res.render('ticket-details', { 
            ticket,
            message,
            action,
            user: req.user
        })
    }

    @Get('event/:id')
    getTickets(eventId: string): Promise<Ticket[]> {
        return this.ticketsService.getTicketByEventId(eventId);
    }

    // @Post()
    // createTicket(@Body() createTicketDto: CreateTicketDto, @Headers() headers): Promise<Ticket> {   
    //     return this.ticketsService.createTicket(createTicketDto, headers.host);
    // }
}
