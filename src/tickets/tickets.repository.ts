import { DataSource, Repository } from "typeorm";
import { Ticket } from "./dto/ticket.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TicketsRepository extends Repository<Ticket> {
    constructor(private dataSource: DataSource) {
        super(Ticket, dataSource.createEntityManager());
    }
}