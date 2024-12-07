import { UserRole } from "../constants/user-role.constant";
export declare class AuthCredentialsDto {
    username: string;
    password: string;
}
export declare class CreateUserDto extends AuthCredentialsDto {
    firstName?: string;
    lastName?: string;
    role?: UserRole;
    organizerId?: string;
}
