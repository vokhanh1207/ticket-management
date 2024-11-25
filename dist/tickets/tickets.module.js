"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketsModule = void 0;
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const tickets_controller_1 = require("./tickets.controller");
const tickets_service_1 = require("./tickets.service");
const typeorm_1 = require("@nestjs/typeorm");
const ticket_entity_1 = require("./dto/ticket.entity");
const events_module_1 = require("../events/events.module");
const mail_service_1 = require("../mail/mail.service");
let TicketsModule = exports.TicketsModule = class TicketsModule {
};
exports.TicketsModule = TicketsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([ticket_entity_1.Ticket]),
            (0, common_1.forwardRef)(() => events_module_1.EventsModule)
        ],
        controllers: [tickets_controller_1.TicketsController],
        providers: [tickets_service_1.TicketsService, config_1.ConfigService, mail_service_1.MailService],
        exports: [tickets_service_1.TicketsService]
    })
], TicketsModule);
//# sourceMappingURL=tickets.module.js.map