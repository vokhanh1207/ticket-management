"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizersModule = void 0;
const common_1 = require("@nestjs/common");
const organizers_controller_1 = require("./organizers.controller");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("../auth/auth.module");
const mail_service_1 = require("../mail/mail.service");
const organizer_entity_1 = require("./dto/organizer.entity");
const organizers_repository_1 = require("./organizers.repository");
const organizers_service_1 = require("./organizers.service");
let OrganizersModule = exports.OrganizersModule = class OrganizersModule {
};
exports.OrganizersModule = OrganizersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([organizer_entity_1.Organizer]),
            auth_module_1.AuthModule
        ],
        controllers: [organizers_controller_1.OrganizersController],
        providers: [organizers_repository_1.OrganizersRepository, organizers_service_1.OrganizersService, mail_service_1.MailService],
        exports: []
    })
], OrganizersModule);
//# sourceMappingURL=organizers.module.js.map