import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { Organizer } from "./dto/organizer.entity";

@Injectable()
export class OrganizersRepository extends Repository<Organizer> {
    constructor(private dataSource: DataSource) {
        super(Organizer, dataSource.createEntityManager());
    }
}