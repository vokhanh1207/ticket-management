"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../auth/user.entity");
const users_controller_1 = require("./users.controller");
const users_service_1 = require("./users.service");
const auth_module_1 = require("../auth/auth.module");
const organizers_module_1 = require("../organizers/organizers.module");
const organizers_service_1 = require("../organizers/organizers.service");
const organizer_entity_1 = require("../organizers/dto/organizer.entity");
const organizers_repository_1 = require("../organizers/organizers.repository");
const auth_service_1 = require("../auth/auth.service");
const user_repository_1 = require("../auth/user.repository");
const auth_middleware_1 = require("../auth/middleware/auth.middleware");
let UsersModule = exports.UsersModule = class UsersModule {
    configure(consumer) {
        consumer
            .apply(auth_middleware_1.AuthMiddleware)
            .forRoutes('users');
    }
};
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, organizer_entity_1.Organizer]),
            auth_module_1.AuthModule,
            organizers_module_1.OrganizersModule
        ],
        controllers: [users_controller_1.UsersController],
        providers: [
            users_service_1.UsersService,
            organizers_service_1.OrganizersService,
            organizers_repository_1.OrganizersRepository,
            auth_service_1.AuthService,
            user_repository_1.UserRepository
        ],
        exports: [users_service_1.UsersService]
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map