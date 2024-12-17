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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const events_repository_1 = require("./events.repository");
const typeorm_1 = require("typeorm");
const tickets_repository_1 = require("../tickets/tickets.repository");
const tickets_service_1 = require("../tickets/tickets.service");
const fs = require("fs");
const QRCode = require("qrcode");
const constants_1 = require("../utils.ts/constants");
let EventsService = exports.EventsService = class EventsService {
    constructor(eventsRepository, ticketRepository, ticketsService) {
        this.eventsRepository = eventsRepository;
        this.ticketRepository = ticketRepository;
        this.ticketsService = ticketsService;
    }
    async getEventById(id) {
        try {
            const found = await this.eventsRepository.findOneBy({ id });
            return found;
        }
        catch (error) {
            return null;
        }
    }
    async getTicketsByEventId(eventId) {
        const tickets = await this.ticketRepository.find({ where: { eventId } });
        return tickets;
    }
    async getEvents() {
        const events = await this.eventsRepository.find({
            where: {
                startTime: (0, typeorm_1.MoreThan)(new Date())
            }
        });
        return events;
    }
    async createEvent(createEventDto, username, origin) {
        if (!createEventDto.organizerId) {
            throw new common_1.BadRequestException('Organizer is required.');
        }
        const event = this.eventsRepository.create({
            name: createEventDto.name,
            description: createEventDto.description,
            startTime: createEventDto.startTime,
            location: createEventDto.location,
            duration: createEventDto.duration,
            organizerId: createEventDto.organizerId,
            createdBy: username
        });
        const dbEvent = await this.eventsRepository.save(event);
        fs.mkdirSync(`${constants_1.TICKET_QR_DIR}/${event.id}`);
        await QRCode.toFile(`${constants_1.EVENT_QR_DIR}/${event.id}.png`, `${origin}/events/${event.id}`, {
            width: 260,
            margin: 2
        });
        dbEvent.qr = `${origin}/qr/events/${event.id}.png`;
        await this.eventsRepository.save(event);
        return dbEvent;
    }
    async updateEvent(eventId, createEventDto) {
        const dbEvent = await this.getEventById(eventId);
        return await this.eventsRepository.save({
            ...dbEvent,
            ...createEventDto
        });
    }
    async regisiterEvent(createTicketDto, origin) {
        const dbEvent = await this.getEventById(createTicketDto.eventId);
        const validateResult = await this.ticketsService.validateRegisterEmail(createTicketDto.eventId, createTicketDto.email);
        return validateResult ? await this.ticketsService.createTicket(createTicketDto, dbEvent, origin) : null;
    }
    async sendRemindEmails(eventId, origin) {
        const event = await this.getEventById(eventId);
        return this.ticketsService.sendRemindEmails(event, origin);
    }
};
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [events_repository_1.EventsRepository,
        tickets_repository_1.TicketsRepository,
        tickets_service_1.TicketsService])
], EventsService);
//# sourceMappingURL=events.service.js.map