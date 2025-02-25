"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsController = void 0;
const common_1 = require("@nestjs/common");
const events_service_1 = require("./events.service");
const create_event_dto_1 = require("./dto/create-event.dto");
const create_ticket_dto_1 = require("../tickets/dto/create-ticket.dto");
const moment = require("moment");
const organizers_service_1 = require("../organizers/organizers.service");
const user_role_constant_1 = require("../auth/constants/user-role.constant");
const mail_schedules_service_1 = require("../mail-schedules/mail-schedules.service");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const fs = require("fs");
const event_auth_guard_1 = require("./guards/event-auth.guard");
const event_file_service_1 = require("./services/event-file.service");
let EventsController = exports.EventsController = class EventsController {
    constructor(eventsService, organizersService, mailSchedulesService, eventFileService) {
        this.eventsService = eventsService;
        this.organizersService = organizersService;
        this.mailSchedulesService = mailSchedulesService;
        this.eventFileService = eventFileService;
    }
    async showEvents(res, req) {
        const events = await this.eventsService.getEvents();
        return res.render('events', { events, user: req.user });
    }
    async showNewEvents(res, req) {
        if (!req.user) {
            return res.redirect('.');
        }
        const organizers = await this.organizersService.getOrganizers();
        return res.render('new-event', { user: req.user, organizers: organizers });
    }
    async createNewEvents(createEventDto, res, req, headers) {
        if (!req.user) {
            return res.redirect('.');
        }
        if (req.user.role !== user_role_constant_1.UserRole.ADMIN) {
            createEventDto.organizerId = req.user.organizerId;
        }
        const event = await this.eventsService.createEvent(createEventDto, req.user.username, headers.origin);
        return res.status(common_1.HttpStatus.CREATED).json({
            message: "Event created successfully",
            data: event
        });
    }
    async getEvent(res, req) {
        const event = await this.eventsService.getEventById(req.params?.eventId);
        if (!event) {
            return res.render('not-found', { event, user: req.user });
        }
        const organizer = await this.organizersService.getOrganizerId(event.organizerId);
        let manageable = false;
        const user = req.user;
        console.log(user);
        if (user?.role === user_role_constant_1.UserRole.ADMIN || user?.organizerId === event.organizerId) {
            manageable = true;
        }
        return res.render('event-details', { event, user: req.user, organizer, manageable });
    }
    async registerEvent(createTicketDto, req, res, headers) {
        createTicketDto.eventId = req.params?.eventId;
        const ticket = await this.eventsService.regisiterEvent(createTicketDto, headers.origin);
        if (ticket) {
            return res.redirect('/tickets/' + ticket.id);
        }
        else {
            const event = await this.eventsService.getEventById(req.params?.eventId);
            return res.render('event-details', {
                event,
                user: req.user,
                message: 'The email provided has already been registered for this event.'
            });
        }
    }
    async showEditEvent(res, req) {
        const event = await this.eventsService.getEventById(req.params?.eventId);
        const organizers = (req.user?.role === user_role_constant_1.UserRole.ADMIN) ?
            await this.organizersService.getOrganizers() :
            [];
        return res.render('new-event', { event, user: req.user, organizers });
    }
    async editEvent(res, req, createEventDto) {
        if (!req.user) {
            return res.redirect('.');
        }
        createEventDto.startTime = moment(createEventDto.startTime).toDate().toISOString();
        const event = await this.eventsService.updateEvent(req.params?.eventId, createEventDto);
        return res.status(common_1.HttpStatus.OK).json({
            message: "Event updated successfully",
            data: event
        });
    }
    async getEventTickets(res, req) {
        const user = req.user;
        if (!req.user) {
            return res.redirect('../' + req.params?.eventId);
        }
        const event = await this.eventsService.getEventById(req.params?.eventId);
        if (user.role !== user_role_constant_1.UserRole.ADMIN && user.organizerId !== event.organizerId) {
            return res.redirect('.');
        }
        const tickets = await this.eventsService.getTicketsByEventId(req.params?.eventId);
        const schedules = await this.mailSchedulesService.getEventMailSchedules(req.params?.eventId);
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
    async remindTickets(eventId, req) {
        return await this.eventsService.sendRemindEmails(eventId, req.get('host'));
    }
    async uploadBanner(eventId, file) {
        if (!file) {
            return { message: 'Banner upload failed' };
        }
        const imageUrl = this.eventFileService.getPublicUrl(eventId, file.filename);
        const event = await this.eventsService.updateBanner(eventId, imageUrl);
        return { message: 'Banner upload successful', event };
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "showEvents", null);
__decorate([
    (0, common_1.Get)('new'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "showNewEvents", null);
__decorate([
    (0, common_1.Post)('new'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_event_dto_1.CreateEventDto, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "createNewEvents", null);
__decorate([
    (0, common_1.Get)(':eventId'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "getEvent", null);
__decorate([
    (0, common_1.Post)(':eventId'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __param(3, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ticket_dto_1.CreateTicketDto, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "registerEvent", null);
__decorate([
    (0, common_1.UseGuards)(event_auth_guard_1.EventEditGuard),
    (0, common_1.Get)(':eventId/edit'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "showEditEvent", null);
__decorate([
    (0, common_1.Post)(':eventId/edit'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, create_event_dto_1.CreateEventDto]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "editEvent", null);
__decorate([
    (0, common_1.Get)(':eventId/tickets'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "getEventTickets", null);
__decorate([
    (0, common_1.Get)(':eventId/remind'),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "remindTickets", null);
__decorate([
    (0, common_1.Post)(':eventId/upload-banner'),
    (0, common_1.UseGuards)(event_auth_guard_1.EventEditGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                if (!req.params.eventId) {
                    throw new common_1.BadRequestException('Event ID is required');
                }
                const path = './public/images/events/' + req.params.eventId;
                fs.mkdirSync(path, { recursive: true });
                cb(null, path);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, uniqueSuffix + (0, path_1.extname)(file.originalname));
            }
        })
    })),
    __param(0, (0, common_1.Param)('eventId')),
    __param(1, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({ fileIsRequired: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "uploadBanner", null);
exports.EventsController = EventsController = __decorate([
    (0, common_1.Controller)('events'),
    __metadata("design:paramtypes", [events_service_1.EventsService,
        organizers_service_1.OrganizersService,
        mail_schedules_service_1.MailSchedulesService,
        event_file_service_1.EventFileService])
], EventsController);
//# sourceMappingURL=events.controller.js.map