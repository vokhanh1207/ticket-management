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
exports.OrganizersService = void 0;
const common_1 = require("@nestjs/common");
const organizers_repository_1 = require("./organizers.repository");
let OrganizersService = exports.OrganizersService = class OrganizersService {
    constructor(organizersRepository) {
        this.organizersRepository = organizersRepository;
    }
    async createOrganizer(createOrganizerDto) {
        console.log('createOrganizerDto ', createOrganizerDto);
        if (!createOrganizerDto.name) {
            return new common_1.BadRequestException();
        }
        else {
            return await this.organizersRepository.save(createOrganizerDto);
        }
    }
    async getOrganizers() {
        return await this.organizersRepository.find();
    }
    async getOrganizerId(id) {
        return await this.organizersRepository.findOne({
            where: { id }
        });
    }
};
exports.OrganizersService = OrganizersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [organizers_repository_1.OrganizersRepository])
], OrganizersService);
//# sourceMappingURL=organizers.service.js.map