import { HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto, CreateUserDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { Response, Request } from 'express';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signUp(createUserDto: CreateUserDto): Promise<User | HttpException>;
    login(body: AuthCredentialsDto, res: Response, req: Request, session: any): Promise<void>;
    logout(req: Request, res: Response): Promise<void>;
}
