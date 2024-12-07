import { TicketStatus } from "../constants";

export class CreateTicketDto {
    area?: string;
    seat?: string;
    eventId?: string;
    email?: string;
    checkInTime?: string;
    checkOutTime?: string;
    status?: TicketStatus;
}
