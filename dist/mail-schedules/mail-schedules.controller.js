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
exports.MailSchedulesController = void 0;
const common_1 = require("@nestjs/common");
const mail_schedules_service_1 = require("./mail-schedules.service");
let MailSchedulesController = exports.MailSchedulesController = class MailSchedulesController {
    constructor(mailSchedulesService) {
        this.mailSchedulesService = mailSchedulesService;
    }
    async upsertMailSchedules(createMailSchedules = [], req, res) {
        const promises = [];
        createMailSchedules
            .filter(item => !item.id)
            .forEach(item => {
            promises.push(this.mailSchedulesService.createEventMailSchedules(item));
        });
        createMailSchedules
            .filter(item => !!item.id)
            .forEach(item => {
            promises.push(this.mailSchedulesService.updateMailSchedule(item.id, item));
        });
        await Promise.all(promises);
        const schedules = await this.mailSchedulesService.getEventMailSchedules(req.params?.eventId);
        res.status(common_1.HttpStatus.OK);
        return res.json(schedules);
    }
    async deleteMailSchedule(req, res) {
        await this.mailSchedulesService.deleteMailSchedule(req.params?.scheduleId);
        const schedules = await this.mailSchedulesService.getEventMailSchedules(req.params?.eventId);
        res.status(common_1.HttpStatus.OK);
        return res.json(schedules);
    }
};
__decorate([
    (0, common_1.Post)('/:eventId'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object, Object]),
    __metadata("design:returntype", Promise)
], MailSchedulesController.prototype, "upsertMailSchedules", null);
__decorate([
    (0, common_1.Delete)('/:eventId/:scheduleId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MailSchedulesController.prototype, "deleteMailSchedule", null);
exports.MailSchedulesController = MailSchedulesController = __decorate([
    (0, common_1.Controller)('mail-schedules'),
    __metadata("design:paramtypes", [mail_schedules_service_1.MailSchedulesService])
], MailSchedulesController);
//# sourceMappingURL=mail-schedules.controller.js.map