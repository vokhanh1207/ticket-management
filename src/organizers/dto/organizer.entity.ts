import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Organizer {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true, type: 'longtext' })
    description?: string;
}