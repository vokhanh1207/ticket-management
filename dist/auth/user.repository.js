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
exports.UserRepository = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const user_role_constant_1 = require("./constants/user-role.constant");
let UserRepository = exports.UserRepository = class UserRepository extends typeorm_1.Repository {
    constructor(dataSource) {
        super(user_entity_1.User, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    async createUser(authCredentialDto, currentUser) {
        const salt = await bcrypt.genSalt();
        const username = authCredentialDto.username;
        const firstName = authCredentialDto.firstName;
        const lastName = authCredentialDto.lastName;
        const organizerId = authCredentialDto.organizerId;
        const role = authCredentialDto.role;
        if (!this.validateAssignedRole(role, currentUser)) {
            throw new common_1.BadRequestException('Assigned role is invalid');
        }
        const hashedPassword = await bcrypt.hash(authCredentialDto.password, salt);
        const user = this.create({
            username,
            password: hashedPassword,
            firstName,
            lastName,
            organizerId,
            role
        });
        try {
            return await this.save(user);
        }
        catch (error) {
            if (error.code === '23505') {
                throw new common_1.ConflictException('Username already exists');
            }
            else {
                throw new common_1.InternalServerErrorException();
            }
        }
    }
    async findUserById(id) {
        return await this.findOne({ where: { id } });
    }
    validateAssignedRole(assignedRole, currentUser) {
        switch (assignedRole) {
            case user_role_constant_1.UserRole.Admin:
                if (currentUser.role !== user_role_constant_1.UserRole.Admin) {
                    return false;
                }
                else {
                    return true;
                }
            case user_role_constant_1.UserRole.OrganizerAdmin:
                if (currentUser.role !== user_role_constant_1.UserRole.Admin && currentUser.role !== user_role_constant_1.UserRole.OrganizerAdmin) {
                    return false;
                }
                else {
                    return true;
                }
            default:
                return true;
        }
    }
};
exports.UserRepository = UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], UserRepository);
//# sourceMappingURL=user.repository.js.map