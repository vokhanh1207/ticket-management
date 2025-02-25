import { HttpException } from '@nestjs/common';
export declare class EventNotFoundException extends HttpException {
    constructor(id: string);
}
export declare class EventValidationException extends HttpException {
    constructor(message: string);
}
