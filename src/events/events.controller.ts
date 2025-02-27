import { Body, Controller, Get, Post, Req, Res, Headers, UseInterceptors, 
         UploadedFile, Param, HttpStatus, HttpCode, UseGuards, BadRequestException,
         ParseFilePipe, FileValidator } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { Response, Request as ExpressRequest } from 'express';
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
import { Organizer } from 'src/organizers/dto/organizer.entity';
import { EventEditGuard } from './guards/event-auth.guard';
import { EventFileService } from './services/event-file.service';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

// Add interface for typed request
interface RequestWithUser extends ExpressRequest {
    user?: User;
}

@Controller('events')
export class EventsController {
    constructor(
        private eventsService: EventsService,
        private organizersService: OrganizersService,
        private mailSchedulesService: MailSchedulesService,
        private eventFileService: EventFileService,
    ) {}

    @Get()
    async showEvents(@Res() res: Response, @Req() req: RequestWithUser) {
        const events = await this.eventsService.getEvents();
        return res.render('events', { 
            events, 
            user: req.user,
            active: 'events'  // Add active menu indicator
        });
    }

    @Get('new')
    async showNewEvents(
        @Res() res: Response,
        @Req() req: RequestWithUser) {
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
        @Req() req: RequestWithUser,
        @Headers() headers
    ) {
        if (!req.user) {
            return res.redirect('.');
        }
        if (req.user.role !== UserRole.ADMIN) {
            createEventDto.organizerId = req.user.organizerId;
        }
        
        const event = await this.eventsService.createEvent(createEventDto, (req.user as any).username, headers.origin);
        return res.status(HttpStatus.CREATED).json({
            message: "Event created successfully",
            data: event
        });
    }

    @Get(':eventId')
    async getEvent(@Res() res: Response, @Req() req: RequestWithUser) {
        const event = await this.eventsService.getEventById(req.params?.eventId);
        if (!event) {
            return res.render('not-found', { event, user: req.user });
        }
        const organizer = await this.organizersService.getOrganizerId(event.organizerId);
        let manageable = false;
        const user = req.user as User;
        console.log(user);
        if (user?.role === UserRole.ADMIN || user?.organizerId === event.organizerId) {
            manageable = true;
        }

        return res.render('event-details', { event, user: req.user, organizer, manageable });
    }

    @Post(':eventId')
    async registerEvent(
        @Body() createTicketDto: CreateTicketDto,
        @Req() req: RequestWithUser,
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

    @UseGuards(EventEditGuard)
    @Get(':eventId/edit')
    async showEditEvent(@Res() res: Response, @Req() req: RequestWithUser) {
        const event = await this.eventsService.getEventById(req.params?.eventId);
        const organizers = (req.user?.role === UserRole.ADMIN) ? 
            await this.organizersService.getOrganizers() : 
            [];

        return res.render('new-event', { event, user: req.user, organizers });
    }

    @Post(':eventId/edit')
    async editEvent(@Res() res: Response, @Req() req: RequestWithUser, @Body() createEventDto: CreateEventDto) {
        if (!req.user) {
            return res.redirect('.');
        }
        createEventDto.startTime = moment(createEventDto.startTime).toDate().toISOString();
        const event = await this.eventsService.updateEvent(req.params?.eventId, createEventDto);

        return res.status(HttpStatus.OK).json({
            message: "Event updated successfully",
            data: event
        });
    }

    @Get(':eventId/tickets')
    async getEventTickets(@Res() res: Response, @Req() req: RequestWithUser) {
        const user = req.user as User;
        if (!req.user) {
            return res.redirect('../' + req.params?.eventId)
        }

        const event = await this.eventsService.getEventById(req.params?.eventId);
        if (user.role !== UserRole.ADMIN && user.organizerId !== event.organizerId) {
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
    async remindTickets(eventId: string, @Req() req: RequestWithUser): Promise<boolean> {
        return await this.eventsService.sendRemindEmails(eventId, req.get('host'));
    }

    @Post(':eventId/upload-banner')
    @UseGuards(EventEditGuard)
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: (req: RequestWithUser & { params: { eventId: string } }, file, cb) => {
                if (!req.params.eventId) {
                    throw new BadRequestException('Event ID is required');
                }
                const path = './public/images/events/' + req.params.eventId;
                fs.mkdirSync(path, { recursive: true });
                cb(null, path);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, uniqueSuffix + extname(file.originalname));
            }
        })
    }))
    async uploadBanner(
        @Param('eventId') eventId: string,
        @UploadedFile(new ParseFilePipe({ fileIsRequired: true })) file: Express.Multer.File
    ) {
        if (!file) {
            return { message: 'Banner upload failed' };
        }

        const imageUrl = this.eventFileService.getPublicUrl(eventId, file.filename);
        const event = await this.eventsService.updateBanner(eventId, imageUrl);

        return { message: 'Banner upload successful', event };
    }
}
