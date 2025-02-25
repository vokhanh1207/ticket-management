import { Optional } from "@nestjs/common";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { EventStatus } from "../constants/event-status.enum";

@Entity()
export class Event {
    @PrimaryGeneratedColumn('increment')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    createdBy: string;

    @Column({ nullable: true, type: 'datetime' })
    createdAt?: Date;

    @Column({ nullable: true, type: 'longtext' })
    description?: string;

    @Column({ nullable: true, type: 'datetime' })
    startTime?: Date;

    @Column({ nullable: true })
    duration?: number;

    @Column({ nullable: true })
    location?: string;

    @Column({
        type: 'enum',
        enum: EventStatus,
        default: EventStatus.PUBLISHED
    })
    status: EventStatus;

    @Column({ nullable: true, type: 'datetime' })
    deletedAt?: Date;

    @Column({ default: false })
    isDeleted: boolean;

    @Column({nullable: true})
    qr?: string;

    @Column({nullable: true})
    organizerId?: string;

    @Column({nullable: true})
    bannerImage?: string;
}