import { Injectable } from '@nestjs/common';
import { MailSchedulesRepository } from './mail-schedules.repository';
import { MailScheduleStatus } from './dto/constants';
import { MailSchedule } from './dto/mail-schedule.entity';
import { MailScheduleDto } from './dto/mail-schedule.dto';
import { LessThan } from 'typeorm/find-options/operator/LessThan';
import { EventsService } from 'src/events/events.service';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class MailSchedulesService {
    constructor(
        private mailSchedulesRepository: MailSchedulesRepository,
        private eventsService: EventsService,
        private configService: ConfigService
    ) {}

    @Cron(CronExpression.EVERY_10_SECONDS, { name: 'remindEmails'})
    handleCron() {
        console.log('asdfasdfasdf sdfsadfasd send mail')
        this.sendMailSchudles();
    }

    async getEventMailSchedules(eventId: string): Promise<MailSchedule[]> {
        try {
            const found = await this.mailSchedulesRepository.findBy({ eventId, status: MailScheduleStatus.Queuing })
            return found;
        } catch (error) {
            return null;
        }
    }

    async createEventMailSchedules(createSchedule: MailScheduleDto): Promise<MailSchedule> {
        try {
            delete createSchedule.id;
            createSchedule.status = createSchedule.status || MailScheduleStatus.Queuing;
            const mailSchedule = this.mailSchedulesRepository.create(createSchedule);
            return await this.mailSchedulesRepository.save(mailSchedule);
        } catch (error) {
            return null;
        }
    }

    async updateMailSchedule(id: string, updatedSchedule: MailScheduleDto): Promise<MailSchedule> {
        const mailSchedule = await this.mailSchedulesRepository.findOne({ where: { id } });
        const updatedMailSchedule = await this.mailSchedulesRepository.save({
            ...mailSchedule,
            ...updatedSchedule
        });
        return updatedMailSchedule;
    }

    async deleteMailSchedule(id: string): Promise<MailSchedule> {
        const mailSchedule = await this.mailSchedulesRepository.findOne({ where: { id } });
        if (mailSchedule) {
            const deleted = await this.mailSchedulesRepository.remove(mailSchedule);
            return deleted;
        }
        return null;
    }

    async sendMailSchudles() {
        try {
            const schedules = await this.getQueuingMailSchudles();
            const origin = this.configService.get('ORIGIN');
            schedules.forEach(async schedule => {
                const event = await this.eventsService.getEventById(schedule.eventId);
                if (event) {
                    this.eventsService.sendRemindEmails(event.id, origin);
                }

                schedule.status = MailScheduleStatus.Sent;
                this.mailSchedulesRepository.save(schedule);
            });
        } catch (error) {
            console.log(error)
        }
    }

    async getQueuingMailSchudles(): Promise<MailSchedule[]> {
        const currentDate = new Date();
        const hour = currentDate.getHours();
        const mailSchedules = await this.mailSchedulesRepository.find({
            where: {
                date: LessThan(currentDate),
                time: hour,
                status: MailScheduleStatus.Queuing,
            }
        });

        return mailSchedules;
    }
}
