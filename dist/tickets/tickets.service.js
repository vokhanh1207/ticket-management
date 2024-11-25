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
exports.TicketsService = void 0;
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const QRCode = require("qrcode");
const ticket_entity_1 = require("./dto/ticket.entity");
const tickets_repository_1 = require("./tickets.repository");
const constants_1 = require("./constants");
const mail_service_1 = require("../mail/mail.service");
let TicketsService = exports.TicketsService = class TicketsService {
    constructor(ticketsRepository, mailService, configService) {
        this.ticketsRepository = ticketsRepository;
        this.mailService = mailService;
        this.configService = configService;
    }
    async getTicketById(id) {
        const found = await this.ticketsRepository.findOneBy({ id });
        if (!found) {
            throw new common_1.NotFoundException(`Ticket with ID "${id}" not found`);
        }
        return found;
    }
    async updateTicket(ticket) {
        await this.ticketsRepository.save(ticket);
        return ticket;
    }
    async createTicket(createTicketDto, event, host) {
        const ticket = this.ticketsRepository.create({
            area: createTicketDto.area,
            eventId: createTicketDto.eventId,
            seat: createTicketDto.seat,
            email: createTicketDto.email,
            status: constants_1.TicketStatus.Active,
            createdAt: new Date()
        });
        const dbTicket = await this.ticketsRepository.save(ticket);
        await QRCode.toFile(`${process.cwd()}/public/tickets/${event.id}/${ticket.id}.png`, `${host.origin}/tickets/${dbTicket.id}/on-scan`, {
            width: 260,
            margin: 0
        });
        dbTicket.qr = `${host.origin}/tickets/${event.id}/${ticket.id}.png`;
        await this.ticketsRepository.save(dbTicket);
        const mailOptions = this.getTicketMailOptions(dbTicket, event, host);
        this.mailService.sendMail(mailOptions);
        return ticket;
    }
    async sendRemindEmails(event, host) {
        try {
            this.getTicketsByEventId(event.id).then((tickets = []) => {
                const removeDuplicates = [...new Map(tickets.map(item => [item['email'], item])).values()];
                removeDuplicates.forEach(ticket => {
                    const mailOptions = this.getRemindMailOptions(ticket, event, host);
                    this.mailService.sendMail(mailOptions);
                });
            });
            return true;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException();
        }
    }
    async getTicketsByEventId(eventId) {
        const tickets = this.ticketsRepository.find({ where: { eventId } });
        return tickets;
    }
    async validateRegisterEmail(eventId, email) {
        const ticket = await this.ticketsRepository.findOne({ where: { eventId, email } });
        return ticket ? false : true;
    }
    getNextAction(ticket) {
        let action = constants_1.TicketAction.CheckIn;
        if (ticket.status === constants_1.TicketStatus.CheckedIn) {
            action = constants_1.TicketAction.CheckOut;
        }
        return action;
    }
    getTicketMailOptions(ticket, event, host) {
        const options = {};
        options.from = `Ticket management <${this.configService.get('EMAIL_USERNAME')}>`;
        options.to = ticket.email;
        options.subject = 'Thank you for registering our event';
        options.html = `
        <div style="max-width: 600px; font-size: 15px;">
            <div style="margin-bottom: 20px; text-align:center; font-size: 22px;">
                ${event.name}
            </div>
            <div style="margin-bottom: 10px; text-align:center;">
                <img src="${ticket.qr}" />
            </div>
            <div style="margin-bottom: 10px">
                <b>Ticket link: </b><a href="${host.origin}/tickets/${ticket.id}">${host.origin}/tickets/${ticket.id}</a>
            </div>
            <div style="margin-bottom: 10px">
                <b>Time: </b>${formatDate(event.startTime)}
            </div>
            <div style="margin-bottom: 10px">
                <b>Location: </b>${event.location}
            </div>
        </div>
        `;
        return options;
    }
    getRemindMailOptions(ticket, event, host) {
        const options = {};
        options.from = `Ticket management <${this.configService.get('EMAIL_USERNAME')}>`;
        options.to = ticket.email;
        options.subject = 'Get Ready! Your Event is Coming Up Soon';
        options.html = `
        <div style="max-width: 600px; font-size: 15px;">
            <div style="margin-bottom: 20px; text-align:center; font-size: 22px;">
                ${event.name}
            </div>
            <div style="margin-bottom: 10px; text-align:center;">
                <img src="${ticket.qr}" />
            </div>
            <div style="margin-bottom: 10px">
                <b>Ticket link: </b><a href="${host.origin}/tickets/${ticket.id}">${host.origin}/tickets/${ticket.id}</a>
            </div>
            <div style="margin-bottom: 10px">
                <b>Time: </b>${formatDate(event.startTime)}
            </div>
            <div style="margin-bottom: 10px">
                <b>Location: </b>${event.location}
            </div>
        </div>
        `;
        return options;
    }
};
exports.TicketsService = TicketsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ticket_entity_1.Ticket)),
    __metadata("design:paramtypes", [tickets_repository_1.TicketsRepository,
        mail_service_1.MailService,
        config_1.ConfigService])
], TicketsService);
//# sourceMappingURL=tickets.service.js.map