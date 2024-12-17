import { MailScheduleStatus } from "./constants";
export declare class MailScheduleDto {
    id: string;
    evenId: string;
    date: string;
    time: number;
    status?: MailScheduleStatus;
}
