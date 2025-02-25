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
import { EVENT_IMAGES_DIR } from 'src/utils.ts/constants';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventNotFoundException, EventValidationException } from './exceptions/event.exception';
import { EventStatus } from './constants/event-status.enum';

@Injectable()
export class EventsService {
    constructor(
        private eventsRepository: EventsRepository,
        private ticketRepository: TicketsRepository,
        private ticketsService: TicketsService
    ) { }

    /**
     * Get event by ID
     * @throws EventNotFoundException if event not found
     */
    async getEventById(id: string): Promise<Event> {
        const found = await this.eventsRepository.findOneBy({ 
            id,
            isDeleted: false 
        });
        
        if (!found) {
            throw new EventNotFoundException(id);
        }
        
        return found;
    }

    async getTicketsByEventId(eventId: string): Promise<Ticket[]> {
        const tickets = await this.ticketRepository.find({ where: { eventId } });

        return tickets;
    }

    async getEvents(): Promise<Event[]> {
        const events = await this.eventsRepository.find({
            where: {
                startTime: MoreThan(new Date())
            },
            order: {
                createdAt: "DESC" // Sort by createdAt from newest to latest
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
            createdAt: new Date(),
            createdBy: username
        });

        const dbEvent = await this.eventsRepository.save(event);
        // create folder for ticket QR codes
        fs.mkdirSync(`${EVENT_IMAGES_DIR}/${event.id}/tickets`, { recursive: true });

        await QRCode.toFile(
            `${EVENT_IMAGES_DIR}/${event.id}/${event.id}.png`,
            `${origin}/events/${event.id}`,
            {
                width: 260,
                margin: 2
            }
        );
        dbEvent.qr = `${origin}/images/events/${event.id}/${event.id}.png`;
        await this.eventsRepository.save(event);

        return dbEvent;
    }

    async updateEvent(eventId: string, updateEventDto: UpdateEventDto): Promise<Event> {
        const dbEvent = await this.getEventById(eventId);

        return await this.eventsRepository.save({
            ...dbEvent,
            ...updateEventDto
        });
    }

    /**
     * Soft delete an event
     * @throws EventNotFoundException if event not found
     */
    async deleteEvent(id: string): Promise<void> {
        const event = await this.getEventById(id);
        event.isDeleted = true;
        event.deletedAt = new Date();
        await this.eventsRepository.save(event);
    }

    /**
     * Update event status
     * @throws EventValidationException for invalid status transitions
     */
    async updateEventStatus(id: string, status: EventStatus): Promise<Event> {
        const event = await this.getEventById(id);
        
        if (status === EventStatus.PUBLISHED && !event.startTime) {
            throw new EventValidationException('Cannot publish event without start time');
        }
        
        event.status = status;
        return this.eventsRepository.save(event);
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

    async updateBanner(eventId: string, bannerImage: string): Promise<Event> {
        return this.updateEvent(eventId, {bannerImage})
    }
}
