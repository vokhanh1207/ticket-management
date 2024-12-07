import { UserRole } from "./constants/user-role.constant";
export declare class User {
    id: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    organizerId: string;
}
