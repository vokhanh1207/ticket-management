import { DataSource, Repository } from "typeorm";
import { MailSchedule } from "./dto/mail-schedule.entity";
export declare class MailSchedulesRepository extends Repository<MailSchedule> {
    private dataSource;
    constructor(dataSource: DataSource);
}
