import { Optional } from "@nestjs/common";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Ticket {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    area?: string;

    @Column({ nullable: true })
    seat?: string;

    @Column()
    eventId: string;

    @Column()
    email: string;

    @Column({ nullable: true, type: 'timestamp' })
    createdAt: string;

    @Column({ nullable: true })
    qr?: string;

    @Column({ nullable: true, type: 'timestamp' })
    checkInTime?: string;

    @Column({ nullable: true, type: 'timestamp' })
    checkOutTime?: string;

    @Column({ nullable: true })
    status?: string;
}