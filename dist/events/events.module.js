"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsModule = void 0;
const common_1 = require("@nestjs/common");
const events_controller_1 = require("./events.controller");
const events_service_1 = require("./events.service");
const typeorm_1 = require("@nestjs/typeorm");
const events_repository_1 = require("./events.repository");
const tickets_module_1 = require("../tickets/tickets.module");
const auth_module_1 = require("../auth/auth.module");
const tickets_repository_1 = require("../tickets/tickets.repository");
const mail_service_1 = require("../mail/mail.service");
const organizers_service_1 = require("../organizers/organizers.service");
const organizers_repository_1 = require("../organizers/organizers.repository");
const mail_schedules_service_1 = require("../mail-schedules/mail-schedules.service");
const mail_schedules_repository_1 = require("../mail-schedules/mail-schedules.repository");
const event_file_service_1 = require("./services/event-file.service");
const auth_redirect_middleware_1 = require("../auth/middleware/auth-redirect.middleware");
let EventsModule = exports.EventsModule = class EventsModule {
    configure(consumer) {
        consumer
            .apply(auth_redirect_middleware_1.AuthRedirectMiddleware)
            .forRoutes('events/:eventId/edit', 'events/:eventId/upload-banner');
    }
};
exports.EventsModule = EventsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([Event]),
            (0, common_1.forwardRef)(() => tickets_module_1.TicketsModule),
            auth_module_1.AuthModule
        ],
        controllers: [events_controller_1.EventsController],
        providers: [events_service_1.EventsService, events_repository_1.EventsRepository, tickets_repository_1.TicketsRepository, mail_service_1.MailService, organizers_service_1.OrganizersService,
            organizers_repository_1.OrganizersRepository,
            mail_schedules_service_1.MailSchedulesService,
            event_file_service_1.EventFileService,
            mail_schedules_repository_1.MailSchedulesRepository
        ],
        exports: [events_service_1.EventsService]
    })
], EventsModule);
//# sourceMappingURL=events.module.js.map