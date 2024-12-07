import { TicketStatus } from "../constants";
export declare class CreateTicketDto {
    area?: string;
    seat?: string;
    eventId?: string;
    email?: string;
    checkInTime?: string;
    checkOutTime?: string;
    status?: TicketStatus;
}
