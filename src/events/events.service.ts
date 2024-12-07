import { Injectable, Headers, BadRequestException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './dto/event.entity';
import { EventsRepository } from './events.repository';
import { MoreThan } from "typeorm"
import { TicketsRepository } from 'src/tickets/tickets.repository';
import { Ticket } from 'src/tickets/dto/ticket.entity';
import { CreateTicketDto } from 'src/tickets/dto/create-ticket.dto';
import { TicketsService } from 'src/tickets/tickets.service';
import * as fs from 'fs'
import * as QRCode from 'qrcode';
import { EVENT_QR_DIR, TICKET_QR_DIR } from 'src/utils.ts/constants';

@Injectable()
export class EventsService {
    constructor(
        private eventsRepository: EventsRepository,
        private ticketRepository: TicketsRepository,
        private ticketsService: TicketsService
    ) { }

    async getEventById(id: string): Promise<Event> {
        try {

            const found = await this.eventsRepository.findOneBy({ id })
            return found;
        } catch (error) {
            return null;
        }
    }

    async getTicketsByEventId(eventId: string): Promise<Ticket[]> {
        const tickets = await this.ticketRepository.find({ where: { eventId } });

        return tickets;
    }

    async getEvents(): Promise<Event[]> {
        const events = await this.eventsRepository.find({
            where: {
                startTime: MoreThan(new Date())
            }
        });

        return events;
    }

    async createEvent(createEventDto: CreateEventDto, username: string, origin: string): Promise<Event> {
        if (!createEventDto.organizerId) {
            throw new BadRequestException('Organizer is required.')
        }
        const event: Event = this.eventsRepository.create({
            name: createEventDto.name,
            description: createEventDto.description,
            startTime: createEventDto.startTime,
            location: createEventDto.location,
            duration: createEventDto.duration,
            organizerId: createEventDto.organizerId,
            createdBy: username
        });

        const dbEvent = await this.eventsRepository.save(event);
        // create folder for ticket QR codes
        fs.mkdirSync(`${TICKET_QR_DIR}/${event.id}`);

        await QRCode.toFile(
            `${EVENT_QR_DIR}/${event.id}.png`,
            `${origin}/events/${event.id}`,
            {
                width: 260,
                margin: 2
            }
        );
        dbEvent.qr = `${origin}/qr/events/${event.id}.png`;
        await this.eventsRepository.save(event);

        return dbEvent;
    }

    async updateEvent(eventId: string, createEventDto: CreateEventDto): Promise<Event> {
        const dbEvent = await this.getEventById(eventId);

        return await this.eventsRepository.save({
            ...dbEvent,
            ...createEventDto
        });
    }

    async regisiterEvent(createTicketDto: CreateTicketDto, origin: string): Promise<Ticket> {
        const dbEvent = await this.getEventById(createTicketDto.eventId);
        const validateResult = await this.ticketsService.validateRegisterEmail(createTicketDto.eventId, createTicketDto.email);

        return validateResult ? await this.ticketsService.createTicket(createTicketDto, dbEvent, origin) : null;
    }

    async sendRemindEmails(eventId: string, origin: string): Promise<boolean> {
        const event = await this.getEventById(eventId);
        return this.ticketsService.sendRemindEmails(event, origin)
    }
}
