"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScannerGuard = void 0;
const common_1 = require("@nestjs/common");
const user_role_constant_1 = require("../constants/user-role.constant");
let ScannerGuard = exports.ScannerGuard = class ScannerGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            const response = context.switchToHttp().getResponse();
            response.redirect('/login?returnUrl=' + encodeURIComponent(request.originalUrl));
            return false;
        }
        return [user_role_constant_1.UserRole.ADMIN, user_role_constant_1.UserRole.ORGANIZER_ADMIN, user_role_constant_1.UserRole.SCANNER].includes(user.role);
    }
};
exports.ScannerGuard = ScannerGuard = __decorate([
    (0, common_1.Injectable)()
], ScannerGuard);
//# sourceMappingURL=scanner.guard.js.map