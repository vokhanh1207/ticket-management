import { HttpException, HttpStatus } from '@nestjs/common';

export class EventNotFoundException extends HttpException {
    constructor(id: string) {
        super(`Event with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }
}

export class EventValidationException extends HttpException {
    constructor(message: string) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}
