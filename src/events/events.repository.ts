import { DataSource, EntityRepository, Repository } from "typeorm";
import { Event } from "./dto/event.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EventsRepository extends Repository<Event> {
    constructor(private dataSource: DataSource) {
        super(Event, dataSource.createEntityManager());
    }
}