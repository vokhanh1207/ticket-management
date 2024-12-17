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
exports.MailSchedulesService = void 0;
const common_1 = require("@nestjs/common");
const mail_schedules_repository_1 = require("./mail-schedules.repository");
const constants_1 = require("./dto/constants");
const LessThan_1 = require("typeorm/find-options/operator/LessThan");
const events_service_1 = require("../events/events.service");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
let MailSchedulesService = exports.MailSchedulesService = class MailSchedulesService {
    constructor(mailSchedulesRepository, eventsService, configService) {
        this.mailSchedulesRepository = mailSchedulesRepository;
        this.eventsService = eventsService;
        this.configService = configService;
    }
    handleCron() {
        console.log('asdfasdfasdf sdfsadfasd send mail');
        this.sendMailSchudles();
    }
    async getEventMailSchedules(eventId) {
        try {
            const found = await this.mailSchedulesRepository.findBy({ eventId });
            return found;
        }
        catch (error) {
            return null;
        }
    }
    async createEventMailSchedules(createSchedule) {
        try {
            delete createSchedule.id;
            createSchedule.status = createSchedule.status || constants_1.MailScheduleStatus.Queuing;
            const mailSchedule = this.mailSchedulesRepository.create(createSchedule);
            return await this.mailSchedulesRepository.save(mailSchedule);
        }
        catch (error) {
            return null;
        }
    }
    async updateMailSchedule(id, updatedSchedule) {
        const mailSchedule = await this.mailSchedulesRepository.findOne({ where: { id } });
        const updatedMailSchedule = await this.mailSchedulesRepository.save({
            ...mailSchedule,
            ...updatedSchedule
        });
        return updatedMailSchedule;
    }
    async deleteMailSchedule(id) {
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
            schedules.forEach(async (schedule) => {
                const event = await this.eventsService.getEventById(schedule.eventId);
                if (event) {
                    this.eventsService.sendRemindEmails(event.id, origin);
                }
                schedule.status = constants_1.MailScheduleStatus.Sent;
                this.mailSchedulesRepository.save(schedule);
            });
        }
        catch (error) {
            console.log(error);
        }
    }
    async getQueuingMailSchudles() {
        const currentDate = new Date();
        const hour = currentDate.getHours();
        const mailSchedules = await this.mailSchedulesRepository.find({
            where: {
                date: (0, LessThan_1.LessThan)(currentDate),
                time: hour,
                status: constants_1.MailScheduleStatus.Queuing,
            }
        });
        return mailSchedules;
    }
};
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_10_SECONDS, { name: 'remindEmails' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MailSchedulesService.prototype, "handleCron", null);
exports.MailSchedulesService = MailSchedulesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mail_schedules_repository_1.MailSchedulesRepository,
        events_service_1.EventsService,
        config_1.ConfigService])
], MailSchedulesService);
//# sourceMappingURL=mail-schedules.service.js.map