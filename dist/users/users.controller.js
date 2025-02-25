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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const user_role_constant_1 = require("../auth/constants/user-role.constant");
const organization_admin_guard_1 = require("./guards/organization-admin.guard");
const auth_service_1 = require("../auth/auth.service");
const auth_credentials_dto_1 = require("../auth/dto/auth-credentials.dto");
let UsersController = exports.UsersController = class UsersController {
    constructor(usersService, authService) {
        this.usersService = usersService;
        this.authService = authService;
    }
    async showUsers(res, req) {
        const currentUser = req.user;
        try {
            const users = currentUser.role === user_role_constant_1.UserRole.ADMIN ?
                await this.usersService.getAllUsers() :
                await this.usersService.getUsersByOrganizerId(currentUser.organizerId);
            return res.render('users', {
                users,
                user: currentUser,
                canManageAdmins: currentUser.role === user_role_constant_1.UserRole.ADMIN
            });
        }
        catch (error) {
            console.error(error);
            return res.render('error', { message: 'Failed to load users' });
        }
    }
    async showNewUser(res, req) {
        const currentUser = req.user;
        const roles = Object.values(user_role_constant_1.UserRole)
            .filter(role => currentUser.role === user_role_constant_1.UserRole.ADMIN || role !== user_role_constant_1.UserRole.ADMIN);
        return res.render('user-form', {
            user: currentUser,
            roles,
            organizers: currentUser.role === user_role_constant_1.UserRole.ADMIN ?
                await this.usersService.getAllOrganizers() : []
        });
    }
    async createUser(createUserDto, req, res) {
        try {
            const user = await this.authService.signUp(createUserDto, req.user);
            return res.status(common_1.HttpStatus.CREATED).json({
                message: "User created successfully",
                data: user
            });
        }
        catch (error) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                message: error.message
            });
        }
    }
    async showEditUser(id, res, req) {
        if (!req.user) {
            return res.render('forbidden');
        }
        try {
            const userToEdit = await this.usersService.findUserWithOrganizerById(id);
            const currentUser = req.user;
            if (currentUser.role !== user_role_constant_1.UserRole.ADMIN &&
                userToEdit.organizerId !== currentUser.organizerId) {
                return res.render('forbidden');
            }
            const roles = Object.values(user_role_constant_1.UserRole)
                .filter(role => currentUser.role === user_role_constant_1.UserRole.ADMIN || role !== user_role_constant_1.UserRole.ADMIN);
            const organizers = currentUser.role === user_role_constant_1.UserRole.ADMIN ?
                await this.usersService.getAllOrganizers() : [];
            return res.render('user-form', {
                userToEdit,
                user: currentUser,
                roles,
                organizers
            });
        }
        catch (error) {
            if (error instanceof common_1.ForbiddenException) {
                return res.render('forbidden');
            }
            console.error(error);
            return res.render('error', { message: 'Failed to load user' });
        }
    }
    async editUser(id, updateUserDto, res, req) {
        if (!req.user) {
            return res.render('forbidden');
        }
        try {
            const updatedUser = await this.usersService.updateUser(id, updateUserDto);
            return res.redirect('/users');
        }
        catch (error) {
            return res.render('error', { message: 'Failed to update user' });
        }
    }
    async deleteUser(id, res, req) {
        try {
            const userToDelete = await this.usersService.findUserById(id);
            const currentUser = req.user;
            if (currentUser.role !== user_role_constant_1.UserRole.ADMIN &&
                (userToDelete.organizerId !== currentUser.organizerId ||
                    userToDelete.role === user_role_constant_1.UserRole.ADMIN)) {
                throw new common_1.ForbiddenException('You do not have permission to delete this user');
            }
            await this.usersService.deleteUser(id);
            return res.status(common_1.HttpStatus.OK).json({
                message: "User deleted successfully"
            });
        }
        catch (error) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                message: error.message
            });
        }
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(organization_admin_guard_1.OrganizationAdminGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "showUsers", null);
__decorate([
    (0, common_1.Get)('new'),
    (0, common_1.UseGuards)(organization_admin_guard_1.OrganizationAdminGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "showNewUser", null);
__decorate([
    (0, common_1.Post)('new'),
    (0, common_1.UseGuards)(organization_admin_guard_1.OrganizationAdminGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_credentials_dto_1.CreateUserDto, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createUser", null);
__decorate([
    (0, common_1.Get)(':id/edit'),
    (0, common_1.UseGuards)(organization_admin_guard_1.OrganizationAdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "showEditUser", null);
__decorate([
    (0, common_1.Post)(':id/edit'),
    (0, common_1.UseGuards)(organization_admin_guard_1.OrganizationAdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, auth_credentials_dto_1.CreateUserDto, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "editUser", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(organization_admin_guard_1.OrganizationAdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteUser", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        auth_service_1.AuthService])
], UsersController);
//# sourceMappingURL=users.controller.js.map