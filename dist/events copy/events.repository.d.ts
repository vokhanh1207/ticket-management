import { DataSource, Repository } from "typeorm";
import { Event } from "./dto/event.entity";
export declare class EventsRepository extends Repository<Event> {
    private dataSource;
    constructor(dataSource: DataSource);
}
