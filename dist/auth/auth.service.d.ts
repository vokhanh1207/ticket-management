import { AuthCredentialsDto, CreateUserDto } from './dto/auth-credentials.dto';
import { UserRepository } from './user.repository';
import { HttpException } from '@nestjs/common';
import { User } from './user.entity';
export declare class AuthService {
    private userRepository;
    constructor(userRepository: UserRepository);
    findUserById(id: string): Promise<User>;
    signUp(authCredentialDto: CreateUserDto): Promise<User | HttpException>;
    signIn(authCredentialsDto: AuthCredentialsDto): Promise<Partial<User>>;
    updateUser(userDto: CreateUserDto): Promise<User>;
}
