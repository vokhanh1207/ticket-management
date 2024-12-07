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
exports.TicketsController = void 0;
const events_service_1 = require("./../events/events.service");
const common_1 = require("@nestjs/common");
const tickets_service_1 = require("./tickets.service");
const constants_1 = require("./constants");
const user_role_constant_1 = require("../auth/constants/user-role.constant");
const create_ticket_dto_1 = require("./dto/create-ticket.dto");
const moment = require("moment");
let TicketsController = exports.TicketsController = class TicketsController {
    constructor(ticketsService, eventsService) {
        this.ticketsService = ticketsService;
        this.eventsService = eventsService;
    }
    async showTicket(id, res, req) {
        const ticket = await this.ticketsService.getTicketById(id);
        let event;
        if (ticket) {
            event = await this.eventsService.getEventById(ticket.eventId);
        }
        let manageable = false;
        const user = req.user;
        if (user?.role === user_role_constant_1.UserRole.Admin || user?.organizerId === event.organizerId) {
            manageable = true;
        }
        return res.render('ticket-details', { event, ticket, user: req.user, manageable });
    }
    async showEditTicket(id, res, req) {
        const user = req.user;
        const ticket = await this.ticketsService.getTicketById(id);
        let event;
        if (ticket) {
            event = await this.eventsService.getEventById(ticket.eventId);
        }
        if (!user && user?.role !== user_role_constant_1.UserRole.Admin && user?.organizerId !== event?.organizerId) {
            return res.redirect('.');
        }
        const statuses = Object.values(constants_1.TicketStatus);
        return res.render('ticket-edit', { event, ticket, user: req.user, statuses });
    }
    async editTicket(id, res, req, createTicketDto) {
        const user = req.user;
        let ticket = await this.ticketsService.getTicketById(id);
        let event;
        if (ticket) {
            event = await this.eventsService.getEventById(ticket.eventId);
        }
        if (!user && user?.role !== user_role_constant_1.UserRole.Admin && user?.organizerId !== event?.organizerId) {
            return res.redirect('.');
        }
        ticket = await this.ticketsService.updateTicket(id, createTicketDto);
        const statuses = Object.values(constants_1.TicketStatus);
        return res.render('ticket-edit', { event, ticket, user: req.user, statuses });
    }
    async checkinTicket(id, res, req) {
        const user = req.user;
        if (!user) {
            return res.redirect(`/tickets/${id}`);
        }
        let ticket = await this.ticketsService.getTicketById(id);
        const event = await this.eventsService.getEventById(ticket.eventId);
        let message = {
            value: '',
            code: ''
        };
        if (user.role !== user_role_constant_1.UserRole.Admin && user.organizerId !== event.organizerId) {
            message.value = `Your organization does not organize this event.`;
            message.code = 'NOT-VALID';
            return res.render('ticket-scan', {
                ticket,
                message,
                event,
                user: req.user
            });
        }
        if (ticket.status === constants_1.TicketStatus.Used) {
            message.value = `The ticket is already used.`;
            message.code = 'USED';
        }
        else if (ticket.status === constants_1.TicketStatus.Expired) {
            message.value = `The ticket is expired.`;
            message.code = 'EXPIRED';
        }
        else if (ticket.status === constants_1.TicketStatus.CheckedIn) {
            ticket.status = constants_1.TicketStatus.Used;
            ticket.checkOutTime = moment(new Date()).toDate().toISOString();
            ticket = await this.ticketsService.updateTicket(ticket.id, ticket);
            message.value = `Checked out.`;
            message.code = 'CHECKED-OUT';
        }
        else {
            ticket.status = constants_1.TicketStatus.CheckedIn;
            ticket.checkInTime = moment(new Date()).toDate().toISOString();
            ;
            ticket = await this.ticketsService.updateTicket(ticket.id, ticket);
            message.value = `Verified!`;
            message.code = 'CHECKED-IN';
        }
        return res.render('ticket-scan', {
            ticket,
            message,
            event,
            user: req.user
        });
    }
    async checkoutTicket(id, res, req) {
        if (!req.user) {
            return res.redirect(`/tickets/${id}`);
        }
        let ticket = await this.ticketsService.getTicketById(id);
        let message;
        if (ticket.status === constants_1.TicketStatus.CheckedIn) {
            message = `The ticket is already used.`;
        }
        else if (ticket.status === constants_1.TicketStatus.Expired) {
            message = `The ticket is expired.`;
        }
        else {
            ticket.status = constants_1.TicketStatus.CheckedIn;
            ticket = await this.ticketsService.updateTicket(ticket.id, ticket);
            message = `Verified!`;
        }
        return res.render('ticket-details', {
            ticket,
            message,
            user: req.user
        });
    }
};
__decorate([
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "showTicket", null);
__decorate([
    (0, common_1.Get)('/:id/edit'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "showEditTicket", null);
__decorate([
    (0, common_1.Post)('/:id/edit'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, create_ticket_dto_1.CreateTicketDto]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "editTicket", null);
__decorate([
    (0, common_1.Get)('/:id/on-scan'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "checkinTicket", null);
__decorate([
    (0, common_1.Get)('/:id/check-out'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "checkoutTicket", null);
exports.TicketsController = TicketsController = __decorate([
    (0, common_1.Controller)('tickets'),
    __metadata("design:paramtypes", [tickets_service_1.TicketsService,
        events_service_1.EventsService])
], TicketsController);
//# sourceMappingURL=tickets.controller.js.map