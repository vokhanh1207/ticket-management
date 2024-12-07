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
exports.AuthService = void 0;
const user_repository_1 = require("./user.repository");
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
let AuthService = exports.AuthService = class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async findUserById(id) {
        return this.userRepository.findUserById(id);
    }
    async signUp(authCredentialDto, user) {
        console.log(authCredentialDto);
        return await this.userRepository.createUser(authCredentialDto, user);
    }
    async signIn(authCredentialsDto) {
        const { username, password } = authCredentialsDto;
        const user = await this.userRepository.findOne({
            where: { username }
        });
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        else {
            return null;
        }
    }
    async updateUser(userDto) {
        const { password, ...user } = await this.userRepository.findOne({
            where: { username: userDto.username }
        });
        console.log(userDto);
        return this.userRepository.save({
            ...user,
            ...userDto
        });
    }
};
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository])
], AuthService);
//# sourceMappingURL=auth.service.js.map