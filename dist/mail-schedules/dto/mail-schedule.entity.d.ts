import { MailScheduleStatus } from "./constants";
export declare class MailSchedule {
    id: string;
    eventId: string;
    date: Date;
    time: number;
    status: MailScheduleStatus;
}
