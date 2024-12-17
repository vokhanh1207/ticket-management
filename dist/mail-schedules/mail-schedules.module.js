"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailSchedulesModule = void 0;
const common_1 = require("@nestjs/common");
const mail_schedules_service_1 = require("./mail-schedules.service");
const typeorm_1 = require("@nestjs/typeorm");
const mail_schedules_repository_1 = require("./mail-schedules.repository");
const mail_schedule_entity_1 = require("./dto/mail-schedule.entity");
const mail_schedules_controller_1 = require("./mail-schedules.controller");
const events_module_1 = require("../events/events.module");
let MailSchedulesModule = exports.MailSchedulesModule = class MailSchedulesModule {
};
exports.MailSchedulesModule = MailSchedulesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([mail_schedule_entity_1.MailSchedule]),
            (0, common_1.forwardRef)(() => events_module_1.EventsModule)
        ],
        controllers: [mail_schedules_controller_1.MailSchedulesController],
        providers: [
            mail_schedules_service_1.MailSchedulesService,
            mail_schedules_repository_1.MailSchedulesRepository
        ],
        exports: [mail_schedules_service_1.MailSchedulesService]
    })
], MailSchedulesModule);
//# sourceMappingURL=mail-schedules.module.js.map