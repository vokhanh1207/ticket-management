import { Event } from './dto/event.entity';
import { Body, Controller, forwardRef, Get, Inject, Param, Post, Req, Res, Headers } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { Response, Request } from 'express';
import { TicketsService } from 'src/tickets/tickets.service';
import { CreateTicketDto } from 'src/tickets/dto/create-ticket.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';

@Controller('events')
export class EventsController {

    constructor(
        private eventsService: EventsService
    ) { }

    @Get()
    async showEvents(@Res() res: Response, @Req() req: Request) {
        const events = await this.eventsService.getEvents();
        return res.render('events', { events, user: req.user });
    }

    @Get('new')
    showNewEvents(
        @Res() res: Response,
        @Req() req: Request) {
        if (!req.user) {
            return res.redirect('.');
        }
        return res.render('new-event', { user: req.user });
    }

    @Post('new')
    async createNewEvents(@Body() createEventDto: CreateEventDto, @Res() res: Response, @Req() req: Request) {
        if (!req.user) {
            return res.redirect('.');
        }
        const event = await this.eventsService.createEvent(createEventDto, (req.user as any).username);
        return res.redirect('/events/' + event.id);
    }

    @Get(':eventId')
    async getEvent(@Res() res: Response, @Req() req: Request) {
        const event = await this.eventsService.getEventById(req.params?.eventId);
        if(!event) {
            return res.render('not-found', { event, user: req.user });
        }
        return res.render('event-details', { event, user: req.user });
    }

    @Get(':eventId/edit')
    async showEditEvent(@Res() res: Response, @Req() req: Request) {
        if (!req.user) {
            return res.redirect('.');
        }
        const event = await this.eventsService.getEventById(req.params?.eventId);
        return res.render('new-event', { event, user: req.user });
    }

    @Post(':eventId/edit')
    async editEvent(@Res() res: Response, @Req() req: Request, @Body() createEventDto: CreateEventDto) {
        if (!req.user) {
            return res.redirect('.');
        }
        const event = await this.eventsService.updateEvent(req.params?.eventId, createEventDto);
        return res.render('event-details', { event, user: req.user });
    }

    @Get(':eventId/tickets')
    async getEventTickets(@Res() res: Response, @Req() req: Request) {
        if (!req.user) {
            return res.redirect('../' + req.params?.eventId)
        }
        const tickets = await this.eventsService.getTicketsByEventId(req.params?.eventId);
        return res.render('tickets', { tickets, user: req.user });
    }

    @Post(':eventId/register')
    async registerEvent(
        @Body() createTicketDto: CreateTicketDto,
        @Req() req: Request,
        @Res() res: Response,
        @Headers() headers) {
        createTicketDto.eventId = req.params?.eventId;
        const ticket = await this.eventsService.regisiterEvent(createTicketDto, headers);
        if (ticket) {
            return res.redirect('/tickets/' + ticket.id);
        } else {
            const event = await this.eventsService.getEventById(req.params?.eventId);
            return res.render('event-details', { event, user: req.user, message: 'The email provided has already been registered for this event.' });
        }
    }

    //@Get('/:id')
    // getEvent(@Param('id') id: string): Promise<Event> {
    //     //return this.ticketsService.getEventById(id);
    // }

    // @Get('event/:id')
    // getEvents(eventId: string): Promise<Event[]> {
    //     return this.ticketsService.getTicketByEventId(eventId);
    // }

    // @Post()
    // createEvent(@Body() createTicketDto: CreateEventDto): Promise<Event> {

    //     //return this.ticketsService.createEvent(createTicketDto);
    // }
}
