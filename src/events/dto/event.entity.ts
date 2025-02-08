import { Optional } from "@nestjs/common";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Event {
    @PrimaryGeneratedColumn('increment')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    createdBy: string;

    @Column({ nullable: true, type: 'datetime' })
    cratedAt?: Date;

    @Column({ nullable: true, type: 'longtext' })
    description?: string;

    @Column({ nullable: true, type: 'datetime' })
    startTime?: Date;

    @Column({ nullable: true })
    duration?: number;

    @Column({ nullable: true })
    location?: string;

    @Column({ nullable: true })
    status?: string;

    @Column({nullable: true})
    qr?: string;

    @Column({nullable: true})
    organizerId?: string;

    @Column({nullable: true})
    bannerImage?: string;
}