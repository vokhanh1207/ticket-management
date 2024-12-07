import { UserRole } from "../constants/user-role.constant";

export class AuthCredentialsDto {
    username: string;
    password: string;
}

export class CreateUserDto extends AuthCredentialsDto {
    firstName?: string;
    lastName?: string;
    role?: UserRole;
    organizerId?: string;
}
