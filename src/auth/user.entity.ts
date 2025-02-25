import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "./constants/user-role.constant";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.SCANNER
    })
    role: UserRole;

    @Column({ nullable: true })
    organizerId?: string;
}