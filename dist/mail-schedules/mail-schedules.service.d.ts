import { MailSchedulesRepository } from './mail-schedules.repository';
import { MailSchedule } from './dto/mail-schedule.entity';
import { MailScheduleDto } from './dto/mail-schedule.dto';
import { EventsService } from 'src/events/events.service';
import { ConfigService } from '@nestjs/config';
export declare class MailSchedulesService {
    private mailSchedulesRepository;
    private eventsService;
    private configService;
    constructor(mailSchedulesRepository: MailSchedulesRepository, eventsService: EventsService, configService: ConfigService);
    handleCron(): void;
    getEventMailSchedules(eventId: string): Promise<MailSchedule[]>;
    createEventMailSchedules(createSchedule: MailScheduleDto): Promise<MailSchedule>;
    updateMailSchedule(id: string, updatedSchedule: MailScheduleDto): Promise<MailSchedule>;
    deleteMailSchedule(id: string): Promise<MailSchedule>;
    sendMailSchudles(): Promise<void>;
    getQueuingMailSchudles(): Promise<MailSchedule[]>;
}
