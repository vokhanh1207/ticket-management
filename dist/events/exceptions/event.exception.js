"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventValidationException = exports.EventNotFoundException = void 0;
const common_1 = require("@nestjs/common");
class EventNotFoundException extends common_1.HttpException {
    constructor(id) {
        super(`Event with ID ${id} not found`, common_1.HttpStatus.NOT_FOUND);
    }
}
exports.EventNotFoundException = EventNotFoundException;
class EventValidationException extends common_1.HttpException {
    constructor(message) {
        super(message, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.EventValidationException = EventValidationException;
//# sourceMappingURL=event.exception.js.map