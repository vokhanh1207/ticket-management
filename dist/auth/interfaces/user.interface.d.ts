import { UserRole } from "../constants/user-role.constant";
export interface IUser {
    id: number;
    username: string;
    role: UserRole;
    organizerId?: string;
}
