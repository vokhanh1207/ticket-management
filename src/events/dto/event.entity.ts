import { Optional } from "@nestjs/common";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Event {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    createdBy: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ nullable: true, type: 'timestamptz' })
    startTime?: Date;

    @Column({ nullable: true })
    duration?: number;

    @Column({ nullable: true })
    location?: string;

    @Column({ nullable: true })
    status?: string;
}