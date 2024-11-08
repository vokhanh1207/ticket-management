import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './dto/event.entity';
import { EventsRepository } from './events.repository';
import { MoreThan } from "typeorm"
import { TicketsRepository } from 'src/tickets/tickets.repository';
import { Ticket } from 'src/tickets/dto/ticket.entity';
import { User } from 'src/auth/user.entity';
import { CreateTicketDto } from 'src/tickets/dto/create-ticket.dto';
import { TicketsService } from 'src/tickets/tickets.service';
import * as fs from 'fs'

@Injectable()
export class EventsService {
    constructor(
        private eventsRepository: EventsRepository,
        private ticketRepository: TicketsRepository,
        private ticketsService: TicketsService
    ) {}

    async getEventById(id: string): Promise<Event> {
        const found = await this.eventsRepository.findOneBy({id})
        if (!found) {
            throw new NotFoundException(`Event with ID "${id}" not found`);
        }

        return found;
    }

    async getTicketsByEventId(eventId: string): Promise<Ticket[]> {
        const tickets = await this.ticketRepository.find({where: {eventId}});

        return tickets;
    }

    async getEvents(): Promise<Event[]> {
        const events = await this.eventsRepository.find({where: {
            startTime: MoreThan(new Date())
        }});

        return events;
    }

    async createEvent(createEventDto: CreateEventDto, username: string): Promise<Event> {
        
        const event: Event = this.eventsRepository.create({
            name: createEventDto.name,
            description: createEventDto.description,
            startTime: createEventDto.startTime,
            location: createEventDto.location,
            duration: createEventDto.duration,
            createdBy: username
        });

        await this.eventsRepository.save(event);

        // create folder for ticket QR codes
        fs.mkdirSync(`${process.cwd()}/public/tickets/${event.id}`);

        return event;
    }

    async updateEvent(eventId: string, createEventDto: CreateEventDto): Promise<Event> {
        const dbEvent = await this.getEventById(eventId);

        return await this.eventsRepository.save({
            ...dbEvent,
            ...createEventDto
        });
    }

    async regisiterEvent(createTicketDto: CreateTicketDto, host): Promise<Ticket> {
        const dbEvent = await this.getEventById(createTicketDto.eventId);
        return await this.ticketsService.createTicket(createTicketDto, dbEvent, host);
    }
}
