import { EventStatus } from "../constants/event-status.enum";
export declare class Event {
    id: string;
    name: string;
    createdBy: string;
    createdAt?: Date;
    description?: string;
    startTime?: Date;
    duration?: number;
    location?: string;
    status: EventStatus;
    deletedAt?: Date;
    isDeleted: boolean;
    qr?: string;
    organizerId?: string;
    bannerImage?: string;
}
