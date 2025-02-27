import { EventsService } from './../events/events.service';
import { Body, Controller, Get, HttpStatus, Param, Post, Req, Res, UseGuards, NotFoundException } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { Event } from 'src/events/dto/event.entity';
import { Response, Request } from 'express';
import { TicketStatus } from './constants';
import { User } from 'src/auth/user.entity';
import { UserRole } from 'src/auth/constants/user-role.constant';
import { CreateTicketDto } from './dto/create-ticket.dto';
import * as moment from 'moment';
import { OrganizationAdminGuard } from 'src/users/guards/organization-admin.guard';
import { ScannerGuard } from 'src/auth/guards/scanner.guard';

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

        let manageable = false;
        const user = req.user as User;
        if (user?.role === UserRole.ADMIN || user?.organizerId === event.organizerId) {
            manageable = true;
        }

        // if admin and action == update => update checkin time
        return res.render('ticket-details', { event, ticket, user: req.user, manageable })
    }

    @Get('/:id/edit')
    async showEditTicket(@Param('id') id: string, @Res() res: Response, @Req() req: Request) {
        const user = req.user as User;

        const ticket = await this.ticketsService.getTicketById(id);
        let event: Event;
        if (ticket) {
            event = await this.eventsService.getEventById(ticket.eventId)
        }

        if (!user && user?.role !== UserRole.ADMIN && user?.organizerId !== event?.organizerId) {
            return res.redirect('.');
        }
        const statuses = Object.values(TicketStatus)
        return res.render('ticket-edit', { event, ticket, user: req.user, statuses })
    }

    @Post('/:id/edit')
    async editTicket(@Param('id') id: string, @Res() res: Response,
        @Req() req: Request,
        @Body() createTicketDto: CreateTicketDto) {
        const user = req.user as User;

        let ticket = await this.ticketsService.getTicketById(id);
        let event: Event;
        if (ticket) {
            event = await this.eventsService.getEventById(ticket.eventId)
        }

        if (!user && user?.role !== UserRole.ADMIN && user?.organizerId !== event?.organizerId) {
            return res.redirect('.');
        }
        ticket = await this.ticketsService.updateTicket(id, createTicketDto);
        const statuses = Object.values(TicketStatus)
        return res.render('ticket-edit', { event, ticket, user: req.user, statuses })
    }

    @Get('/:id/on-scan')
    @UseGuards(OrganizationAdminGuard)
    async checkinTicket(
        @Param('id') id: string,
        @Res() res: Response,
        @Req() req: Request,
    ) {
        const user: User = req.user as User;
        if (!user) {
            return res.redirect(`/tickets/${id}`);
        }
        let ticket = await this.ticketsService.getTicketById(id);
        const event = await this.eventsService.getEventById(ticket.eventId);

        let message: { value: string; code: string } = {
            value: '',
            code: ''
        };

        if (user.role !== UserRole.ADMIN && user.organizerId !== event.organizerId) {
            message.value = `Your organization does not organize this event.`;
            message.code = 'NOT-VALID';
            return res.render('ticket-scan', {
                ticket,
                message,
                event,
                user: req.user
            })
        }

        // if admin and action == update => update checkin time
        if (ticket.status === TicketStatus.Used) {
            message.value = `The ticket is already used.`;
            message.code = 'USED';
        } else if (ticket.status === TicketStatus.Expired) {
            message.value = `The ticket is expired.`;
            message.code = 'EXPIRED';
        } else if (ticket.status === TicketStatus.CheckedIn) {
            ticket.status = TicketStatus.Used;
            ticket.checkOutTime = moment(new Date()).toDate().toISOString();
            ticket = await this.ticketsService.updateTicket(ticket.id, ticket);
            message.value = `Checked out.`;
            message.code = 'CHECKED-OUT';
        } else {
            ticket.status = TicketStatus.CheckedIn;
            ticket.checkInTime = moment(new Date()).toDate().toISOString();;
            ticket = await this.ticketsService.updateTicket(ticket.id, ticket);
            message.value = `Verified!`;
            message.code = 'CHECKED-IN';
        }

        return res.render('ticket-scan', {
            ticket,
            message,
            event,
            user: req.user
        })
    }

    @Get(':id/on-scan')
    async onScanTicket(@Param('id') id: string, @Res() res: Response) {
        try {
            const ticket = await this.ticketsService.getTicketById(id);
            const event = await this.eventsService.getEventById(ticket.eventId);

            return res.status(HttpStatus.OK).json({
                success: true,
                message: 'Ticket found',
                data: { ticket, event }
            });
        } catch (error) {
            const status = error instanceof NotFoundException ?
                HttpStatus.NOT_FOUND : HttpStatus.INTERNAL_SERVER_ERROR;

            return res.status(status).json({
                success: false,
                message: error.message,
                data: null
            });
        }
    }

    @Get('/:id/on-scan-api')
    @UseGuards(ScannerGuard)
    async checkinTicketApi(
        @Param('id') id: string,
        @Res() res: Response,
        @Req() req: Request,
    ) {
        try {
            const user: User = req.user as User;
            if (!user || !user.id) {
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    success: false,
                    message: 'Session expired. Please login again.',
                    data: null
                });
            }

            let ticket = await this.ticketsService.getTicketById(id);
            const event = await this.eventsService.getEventById(ticket.eventId);

            if (user.role !== UserRole.ADMIN && user.organizerId !== event.organizerId) {
                return res.status(HttpStatus.FORBIDDEN).json({
                    success: false,
                    message: 'Your organization does not organize this event.',
                    data: null
                });
            }

            let messageCode: string;
            let messageText: string;

            if (ticket.status === TicketStatus.Used) {
                messageCode = 'USED';
                messageText = 'The ticket is already used.';
            } else if (ticket.status === TicketStatus.Expired) {
                messageCode = 'EXPIRED';
                messageText = 'The ticket is expired.';
            } else if (ticket.status === TicketStatus.CheckedIn) {
                ticket.status = TicketStatus.Used;
                ticket.checkOutTime = moment(new Date()).toDate().toISOString();
                ticket = await this.ticketsService.updateTicket(ticket.id, ticket);
                messageCode = 'CHECKED-OUT';
                messageText = 'Checked out.';
            } else {
                ticket.status = TicketStatus.CheckedIn;
                ticket.checkInTime = moment(new Date()).toDate().toISOString();
                ticket = await this.ticketsService.updateTicket(ticket.id, ticket);
                messageCode = 'CHECKED-IN';
                messageText = 'Verified!';
            }

            return res.status(HttpStatus.OK).json({
                success: true,
                message: { value: messageText, code: messageCode },
                data: { ticket, event }
            });

        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Session expired. Please login again.',
                data: null
            });
        }
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
        if (ticket.status === TicketStatus.CheckedIn) {
            message = `The ticket is already used.`;
        } else if (ticket.status === TicketStatus.Expired) {
            message = `The ticket is expired.`;
        } else {
            ticket.status = TicketStatus.CheckedIn;
            ticket = await this.ticketsService.updateTicket(ticket.id, ticket);
            message = `Verified!`;
        }

        return res.render('ticket-details', {
            ticket,
            message,
            user: req.user
        })
    }

}
