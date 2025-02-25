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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const auth_service_1 = require("./auth/auth.service");
const auth_credentials_dto_1 = require("./auth/dto/auth-credentials.dto");
const local_auth_guard_1 = require("./auth/local-auth.guard");
const user_role_constant_1 = require("./auth/constants/user-role.constant");
const organizers_service_1 = require("./organizers/organizers.service");
let AppController = exports.AppController = class AppController {
    constructor(appService, authService, organizerService) {
        this.appService = appService;
        this.authService = authService;
        this.organizerService = organizerService;
    }
    getLandingPage(res, req) {
        return res.redirect('/events');
    }
    login(res, req) {
        if (req.user) {
            return res.redirect('/events');
        }
        return res.render('login', { user: req.user });
    }
    async postLogin(body, res, req, session) {
        const user = await this.authService.signIn(body);
        if (user) {
            session.userId = user.id;
            return res.redirect('../events');
        }
        else {
            return res.render('login', { message: 'Username or password is incorrect', user: req.user });
        }
    }
    async getMyProfile(res, req) {
        if (!req.user) {
            return res.redirect('/events');
        }
        const user = await this.authService.findUserById(req.user.id);
        const organizer = await this.organizerService.getOrganizerId(user.organizerId);
        return res.render('my-profile', { user, organizer });
    }
    async updateMyProfile(res, req, userDto) {
        const user = req.user;
        if (!user) {
            return res.redirect('/events');
        }
        const updatedUser = await this.authService.updateUser(userDto);
        return res.render('my-profile', { user: updatedUser });
    }
    async showAddUser(res, req, userDto) {
        if (!req.user && req.user?.role !== user_role_constant_1.UserRole.ADMIN && req.user?.role !== user_role_constant_1.UserRole.ORGANIZER_ADMIN) {
            return res.redirect('/events');
        }
        const organizers = await this.organizerService.getOrganizers();
        let roles = Object.values(user_role_constant_1.UserRole);
        if (req.user.role === user_role_constant_1.UserRole.ORGANIZER_ADMIN) {
            roles = roles.filter(item => item !== user_role_constant_1.UserRole.ADMIN);
        }
        return res.render('user-form', {
            user: req.user,
            roles,
            organizers
        });
    }
    async addUser(res, req, userDto) {
        if (!req.user) {
            return res.redirect('/events');
        }
        const currentUser = req.user;
        try {
            if (currentUser.role === user_role_constant_1.UserRole.ORGANIZER_ADMIN) {
                if (userDto.role === user_role_constant_1.UserRole.ADMIN) {
                    throw new Error('You are not allowed to assign the admin role to a user.');
                }
                userDto.organizerId = currentUser.organizerId;
            }
            const user = await this.authService.signUp(userDto, currentUser);
            return res.render('user-form', {
                user: currentUser,
                message: 'User created successfully',
                roles: Object.values(user_role_constant_1.UserRole).filter(role => currentUser.role === user_role_constant_1.UserRole.ADMIN || role !== user_role_constant_1.UserRole.ADMIN),
                organizers: currentUser.role === user_role_constant_1.UserRole.ADMIN ?
                    await this.organizerService.getOrganizers() : []
            });
        }
        catch (error) {
            return res.render('user-form', {
                user: currentUser,
                message: error.message,
                roles: Object.values(user_role_constant_1.UserRole).filter(role => currentUser.role === user_role_constant_1.UserRole.ADMIN || role !== user_role_constant_1.UserRole.ADMIN),
                organizers: currentUser.role === user_role_constant_1.UserRole.ADMIN ?
                    await this.organizerService.getOrganizers() : []
            });
        }
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getLandingPage", null);
__decorate([
    (0, common_1.Get)('login'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('/login'),
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_credentials_dto_1.AuthCredentialsDto, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "postLogin", null);
__decorate([
    (0, common_1.Get)('my-profile'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getMyProfile", null);
__decorate([
    (0, common_1.Post)('my-profile'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, auth_credentials_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "updateMyProfile", null);
__decorate([
    (0, common_1.Get)('add-user'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, auth_credentials_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "showAddUser", null);
__decorate([
    (0, common_1.Post)('add-user'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, auth_credentials_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "addUser", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        auth_service_1.AuthService,
        organizers_service_1.OrganizersService])
], AppController);
//# sourceMappingURL=app.controller.js.map