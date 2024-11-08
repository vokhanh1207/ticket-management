export class AuthCredentialsDto {
    username: string;
    password: string;
}

export class CreateUserDto extends AuthCredentialsDto {
    firstName?: string;
    lastName?: string;
}
