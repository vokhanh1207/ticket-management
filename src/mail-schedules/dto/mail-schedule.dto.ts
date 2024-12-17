import { MailScheduleStatus } from "./constants";

export class MailScheduleDto {
    id: string;
    evenId: string;
    date: string;
    time: number;
    status?: MailScheduleStatus;
}