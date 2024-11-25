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
let EventsController = exports.EventsController = class EventsController {
    constructor(eventsService) {
        this.eventsService = eventsService;
    }
    async showEvents(res, req) {
        const events = await this.eventsService.getEvents();
        return res.render('events', { events, user: req.user });
    }
    showNewEvents(res, req) {
        if (!req.user) {
            return res.redirect('.');
        }
        return res.render('new-event', { user: req.user });
    }
    async createNewEvents(createEventDto, res, req) {
        if (!req.user) {
            return res.redirect('.');
        }
        const event = await this.eventsService.createEvent(createEventDto, req.user.username);
        return res.redirect('/events/' + event.id);
    }
    async getEvent(res, req) {
        const event = await this.eventsService.getEventById(req.params?.eventId);
        if (!event) {
            return res.render('not-found', { event, user: req.user });
        }
        return res.render('event-details', { event, user: req.user });
    }
    async registerEvent(createTicketDto, req, res, headers) {
        createTicketDto.eventId = req.params?.eventId;
        const ticket = await this.eventsService.regisiterEvent(createTicketDto, req.get('origin'));
        if (ticket) {
            return res.redirect('/tickets/' + ticket.id);
        }
        else {
            const event = await this.eventsService.getEventById(req.params?.eventId);
            return res.render('event-details', { event, user: req.user, message: 'The email provided has already been registered for this event.' });
        }
    }
    async showEditEvent(res, req) {
        if (!req.user) {
            return res.redirect('.');
        }
        const event = await this.eventsService.getEventById(req.params?.eventId);
        return res.render('new-event', { event, user: req.user });
    }
    async editEvent(res, req, createEventDto) {
        if (!req.user) {
            return res.redirect('.');
        }
        createEventDto.startTime = moment(createEventDto.startTime).toDate().toISOString();
        const event = await this.eventsService.updateEvent(req.params?.eventId, createEventDto);
        return res.redirect('/events/' + req.params?.eventId);
    }
    async getEventTickets(res, req) {
        if (!req.user) {
            return res.redirect('../' + req.params?.eventId);
        }
        const tickets = await this.eventsService.getTicketsByEventId(req.params?.eventId);
        return res.render('tickets', { tickets, user: req.user, eventId: req.params?.eventId });
    }
    async remindTickets(eventId, req) {
        return await this.eventsService.sendRemindEmails(eventId, req.get('origin'));
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
    __metadata("design:returntype", void 0)
], EventsController.prototype, "showNewEvents", null);
__decorate([
    (0, common_1.Post)('new'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_event_dto_1.CreateEventDto, Object, Object]),
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
exports.EventsController = EventsController = __decorate([
    (0, common_1.Controller)('events'),
    __metadata("design:paramtypes", [events_service_1.EventsService])
], EventsController);
//# sourceMappingURL=events.controller.js.map