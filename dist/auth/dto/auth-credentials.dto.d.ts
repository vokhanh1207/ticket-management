export declare class AuthCredentialsDto {
    username: string;
    password: string;
}
export declare class CreateUserDto extends AuthCredentialsDto {
    firstName?: string;
    lastName?: string;
}
