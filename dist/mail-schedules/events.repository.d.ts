import { DataSource, Repository } from "typeorm";
import { Event } from "./dto/mail-schedule.entity";
export declare class EventsRepository extends Repository<Event> {
    private dataSource;
    constructor(dataSource: DataSource);
}
