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
exports.OrganizersController = void 0;
const common_1 = require("@nestjs/common");
const organizers_service_1 = require("./organizers.service");
const user_role_constant_1 = require("../auth/constants/user-role.constant");
const create_organizer_dto_1 = require("./dto/create-organizer.dto");
let OrganizersController = exports.OrganizersController = class OrganizersController {
    constructor(organizersService) {
        this.organizersService = organizersService;
    }
    async showOrganizers(res, req) {
        if (!req.user && req.user?.role !== user_role_constant_1.UserRole.ADMIN) {
            return res.render('forbidden');
        }
        try {
            const organizers = await this.organizersService.getOrganizers();
            return res.render('organizers', { user: req.user, organizers });
        }
        catch (error) {
            console.log(error);
        }
    }
    showNewOrganizer(res, req) {
        if (!req.user || req.user?.role !== user_role_constant_1.UserRole.ADMIN) {
            return res.render('forbidden');
        }
        return res.render('organizer-create-edit', { user: req.user });
    }
    async newOrganizer(res, req, createOrganizerDto) {
        if (!req.user || req.user?.role !== user_role_constant_1.UserRole.ADMIN) {
            return res.render('forbidden');
        }
        try {
            const organizer = await this.organizersService.createOrganizer(createOrganizerDto);
            return res.render('organizer-create-edit', { user: req.user, organizer });
        }
        catch (error) {
            console.log(error);
        }
    }
    async getOrganizer(res, req) {
        const organizerId = req.params?.organizerId;
        const organizer = await this.organizersService.getOrganizerId(req.params?.organizerId);
        if (!organizer) {
            return res.render('not-found', { user: req.user });
        }
        return res.render('organizer', { organizer, user: req.user });
    }
    async updateMyOrganization(res, req, createOrganizerDto) {
        const organizerId = req.params?.organizerId;
        if (!req.user) {
            return res.redirect(`/organizers/${organizerId}`);
        }
        const user = req.user;
        if (user &&
            user?.role === user_role_constant_1.UserRole.ADMIN ||
            (user?.role === user_role_constant_1.UserRole.ORGANIZER_ADMIN && user.organizerId === organizerId)) {
            await this.organizersService.updateOrganizers(req.user.organizerId, createOrganizerDto);
        }
        return res.redirect(`/organizers/${organizerId}`);
    }
    async showEditOrganizer(res, req) {
        const organizerId = req.params?.organizerId;
        if (!organizerId) {
            return res.redirect('/organizers');
        }
        const user = req.user;
        if (!user || (user.role !== user_role_constant_1.UserRole.ADMIN && user.organizerId !== organizerId)) {
            return res.render('forbidden');
        }
        const organizer = await this.organizersService.getOrganizerId(organizerId);
        if (!organizer) {
            return res.render('not-found');
        }
        return res.render('organizer-create-edit', {
            organizer,
            user: req.user
        });
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizersController.prototype, "showOrganizers", null);
__decorate([
    (0, common_1.Get)('new'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], OrganizersController.prototype, "showNewOrganizer", null);
__decorate([
    (0, common_1.Post)('new'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, create_organizer_dto_1.CreateOrganizerDto]),
    __metadata("design:returntype", Promise)
], OrganizersController.prototype, "newOrganizer", null);
__decorate([
    (0, common_1.Get)(':organizerId'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizersController.prototype, "getOrganizer", null);
__decorate([
    (0, common_1.Post)(':organizerId'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, create_organizer_dto_1.CreateOrganizerDto]),
    __metadata("design:returntype", Promise)
], OrganizersController.prototype, "updateMyOrganization", null);
__decorate([
    (0, common_1.Get)(':organizerId/edit'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizersController.prototype, "showEditOrganizer", null);
exports.OrganizersController = OrganizersController = __decorate([
    (0, common_1.Controller)('organizers'),
    __metadata("design:paramtypes", [organizers_service_1.OrganizersService])
], OrganizersController);
//# sourceMappingURL=organizers.controller.js.map