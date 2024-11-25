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
        const action = this.ticketsService.getNextAction(ticket);
        return res.render('ticket-details', { event, ticket, action, user: req.user });
    }
    async checkinTicket(id, res, req) {
        if (!req.user) {
            return res.redirect(`/tickets/${id}`);
        }
        let ticket = await this.ticketsService.getTicketById(id);
        let message = {
            value: '',
            code: ''
        };
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
            ticket = await this.ticketsService.updateTicket(ticket);
            message.value = `Checked out.`;
            message.code = 'CHECKED-OUT';
        }
        else {
            ticket.status = constants_1.TicketStatus.CheckedIn;
            ticket = await this.ticketsService.updateTicket(ticket);
            message.value = `Verified!`;
            message.code = 'CHECKED-IN';
        }
        const action = this.ticketsService.getNextAction(ticket);
        const event = await this.eventsService.getEventById(ticket.eventId);
        return res.render('ticket-details', {
            ticket,
            message,
            action,
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
            ticket = await this.ticketsService.updateTicket(ticket);
            message = `Verified!`;
        }
        const action = this.ticketsService.getNextAction(ticket);
        return res.render('ticket-details', {
            ticket,
            message,
            action,
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