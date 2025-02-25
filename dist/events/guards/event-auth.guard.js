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
exports.EventEditGuard = void 0;
const common_1 = require("@nestjs/common");
const events_service_1 = require("../events.service");
const user_role_constant_1 = require("../../auth/constants/user-role.constant");
let EventEditGuard = exports.EventEditGuard = class EventEditGuard {
    constructor(eventsService) {
        this.eventsService = eventsService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const eventId = request.params.eventId;
        if (!user)
            return false;
        if (user.role === user_role_constant_1.UserRole.SCANNER)
            return false;
        if (user.role === user_role_constant_1.UserRole.ADMIN)
            return true;
        if (user.role === user_role_constant_1.UserRole.ORGANIZER_ADMIN) {
            const event = await this.eventsService.getEventById(eventId);
            return user.organizerId === event.organizerId;
        }
        return false;
    }
};
exports.EventEditGuard = EventEditGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [events_service_1.EventsService])
], EventEditGuard);
//# sourceMappingURL=event-auth.guard.js.map