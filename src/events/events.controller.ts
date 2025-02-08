import { Body, Controller, Get, Post, Req, Res, Headers, UseInterceptors, UploadedFile, Param } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { Response, Request } from 'express';
import { CreateTicketDto } from 'src/tickets/dto/create-ticket.dto';
import * as moment from 'moment'
import { OrganizersService } from 'src/organizers/organizers.service';
import { User } from 'src/auth/user.entity';
import { UserRole } from 'src/auth/constants/user-role.constant';
import { MailSchedulesService } from 'src/mail-schedules/mail-schedules.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

@Controller('events')
export class EventsController {

    constructor(
        private eventsService: EventsService,
        private organizersService: OrganizersService,
        private mailSchedulesService: MailSchedulesService,
    ) { }

    @Get()
    async showEvents(@Res() res: Response, @Req() req: Request) {
        const events = await this.eventsService.getEvents();
        return res.render('events', { events, user: req.user });
    }

    @Get('new')
    async showNewEvents(
        @Res() res: Response,
        @Req() req: Request) {
        if (!req.user) {
            return res.redirect('.');
        }
        const organizers = await this.organizersService.getOrganizers();
        return res.render('new-event', { user: req.user, organizers: organizers });
    }

    @Post('new')
    async createNewEvents(
        @Body() createEventDto: CreateEventDto,
        @Res() res: Response,
        @Req() req: Request,
        @Headers() headers
    ) {
        if (!req.user) {
            return res.redirect('.');
        }
        if ((req.user as User).role !== UserRole.Admin) {
            createEventDto.organizerId = (req.user as User).organizerId;
        }
        const event = await this.eventsService.createEvent(createEventDto, (req.user as any).username, headers.origin);
        return res.redirect('/events/' + event.id);
    }

    @Get(':eventId')
    async getEvent(@Res() res: Response, @Req() req: Request) {
        const event = await this.eventsService.getEventById(req.params?.eventId);
        if (!event) {
            return res.render('not-found', { event, user: req.user });
        }
        const organizer = await this.organizersService.getOrganizerId(event.organizerId);
        let manageable = false;
        const user = req.user as User;
        if (user?.role === UserRole.Admin || user?.organizerId === event.organizerId) {
            manageable = true;
        }

        return res.render('event-details', { event, user: req.user, organizer, manageable });
    }

    @Post(':eventId')
    async registerEvent(
        @Body() createTicketDto: CreateTicketDto,
        @Req() req: Request,
        @Res() res: Response,
        @Headers() headers) {
        createTicketDto.eventId = req.params?.eventId;
        const ticket = await this.eventsService.regisiterEvent(createTicketDto, headers.origin);
        if (ticket) {
            return res.redirect('/tickets/' + ticket.id);
        } else {
            const event = await this.eventsService.getEventById(req.params?.eventId);
            return res.render('event-details', {
                event,
                user: req.user,
                message: 'The email provided has already been registered for this event.'
            });
        }
    }

    @Get(':eventId/edit')
    async showEditEvent(@Res() res: Response, @Req() req: Request) {
        const user = req.user as User;
        if (!user) {
            return res.redirect('.');
        }
        const event = await this.eventsService.getEventById(req.params?.eventId);
        if (user.organizerId !== event.organizerId) {
            return res.redirect('.');
        }

        return res.render('new-event', { event, user: req.user });
    }

    @Post(':eventId/edit')
    async editEvent(@Res() res: Response, @Req() req: Request, @Body() createEventDto: CreateEventDto) {
        if (!req.user) {
            return res.redirect('.');
        }
        createEventDto.startTime = moment(createEventDto.startTime).toDate().toISOString();
        const event = await this.eventsService.updateEvent(req.params?.eventId, createEventDto);

        return res.redirect('/events/' + req.params?.eventId);
    }

    @Get(':eventId/tickets')
    async getEventTickets(@Res() res: Response, @Req() req: Request) {
        const user = req.user as User;
        if (!req.user) {
            return res.redirect('../' + req.params?.eventId)
        }

        const event = await this.eventsService.getEventById(req.params?.eventId);
        if (user.role !== UserRole.Admin && user.organizerId !== event.organizerId) {
            return res.redirect('.');
        }

        const tickets = await this.eventsService.getTicketsByEventId(req.params?.eventId);
        const schedules: any = await this.mailSchedulesService.getEventMailSchedules(req.params?.eventId);
        (schedules || []).forEach(item => {
            item.date = item.date?.toISOString().split('T')[0];
        });
        return res.render('tickets', {
            tickets: JSON.stringify(tickets),
            user: req.user,
            eventId: req.params?.eventId,
            schedules
        });
    }


    @Get(':eventId/remind')
    async remindTickets(eventId: string, @Req() req: Request): Promise<boolean> {
        return await this.eventsService.sendRemindEmails(eventId, req.get('host'));
    }

    @Post(':eventId/upload-banner')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: (req, file, cb) => {
                    const eventId = req.params.eventId;
                    const uploadPath = `./public/images/events/${eventId}`;

                    // Ensure the directory exists
                    fs.mkdirSync(uploadPath, { recursive: true });

                    cb(null, uploadPath);
                },
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, uniqueSuffix + extname(file.originalname));
                },
            }),
        }),
    )
    async uploadFile(@Param('eventId') eventId: string, @UploadedFile() file: Express.Multer.File) {
        if (!file) {
            return { message: 'Banner upload failed' };
        }

        // Construct the public image URL (assuming static files are served)
        const imageUrl = `/images/events/${eventId}/${file.filename}`;

        // Save image URL to the database
        const event = await this.eventsService.updateBanner(eventId, imageUrl);

        return { message: 'Banner uploaded successfully', event };;
    }
}
