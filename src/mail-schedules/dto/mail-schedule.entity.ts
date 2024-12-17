import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { MailScheduleStatus } from "./constants";

@Entity()
export class MailSchedule {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    eventId: string;

    @Column()
    date: Date;

    @Column()
    time: number;

    @Column()
    status: MailScheduleStatus;
}