import { DataSource, Repository } from "typeorm";
import { MailSchedule } from "./dto/mail-schedule.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailSchedulesRepository extends Repository<MailSchedule> {
    constructor(private dataSource: DataSource) {
        super(MailSchedule, dataSource.createEntityManager());
    }
}