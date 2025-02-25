"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventFileService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
let EventFileService = exports.EventFileService = class EventFileService {
    constructor() {
        this.uploadPath = './public/images/events';
    }
    getEventUploadPath(eventId) {
        const path = `${this.uploadPath}/${eventId}`;
        if (!(0, fs_1.existsSync)(path)) {
            (0, fs_1.mkdirSync)(path, { recursive: true });
        }
        return path;
    }
    generateFileName(originalname) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        return `${uniqueSuffix}${(0, path_1.extname)(originalname)}`;
    }
    getPublicUrl(eventId, filename) {
        return `/images/events/${eventId}/${filename}`;
    }
};
exports.EventFileService = EventFileService = __decorate([
    (0, common_1.Injectable)()
], EventFileService);
//# sourceMappingURL=event-file.service.js.map