import { Response, Request } from 'express';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from '../auth/dto/auth-credentials.dto';
export declare class UsersController {
    private usersService;
    private authService;
    constructor(usersService: UsersService, authService: AuthService);
    showUsers(res: Response, req: Request): Promise<void>;
    showNewUser(res: Response, req: Request): Promise<void>;
    createUser(createUserDto: CreateUserDto, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    showEditUser(id: string, res: Response, req: Request): Promise<void>;
    editUser(id: string, updateUserDto: CreateUserDto, res: Response, req: Request): Promise<void>;
    deleteUser(id: string, res: Response, req: Request): Promise<Response<any, Record<string, any>>>;
}
