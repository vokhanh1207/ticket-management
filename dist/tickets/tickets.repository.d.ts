import { DataSource, Repository } from "typeorm";
import { Ticket } from "./dto/ticket.entity";
export declare class TicketsRepository extends Repository<Ticket> {
    private dataSource;
    constructor(dataSource: DataSource);
}
