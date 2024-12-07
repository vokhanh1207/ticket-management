import { DataSource, Repository } from "typeorm";
import { Organizer } from "./dto/organizer.entity";
export declare class OrganizersRepository extends Repository<Organizer> {
    private dataSource;
    constructor(dataSource: DataSource);
}
