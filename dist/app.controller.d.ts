import { AppService } from './app.service';
import { Response, Request } from 'express';
import { AuthService } from './auth/auth.service';
import { AuthCredentialsDto, CreateUserDto } from './auth/dto/auth-credentials.dto';
import { OrganizersService } from './organizers/organizers.service';
export declare class AppController {
    private readonly appService;
    private readonly authService;
    private readonly organizerService;
    constructor(appService: AppService, authService: AuthService, organizerService: OrganizersService);
    getLandingPage(res: Response, req: Request): void;
    login(res: Response, req: Request): void;
    postLogin(body: AuthCredentialsDto, res: Response, req: Request, session: any): Promise<void>;
    getMyProfile(res: Response, req: Request): Promise<void>;
    updateMyProfile(res: Response, req: Request, userDto: CreateUserDto): Promise<void>;
    showAddUser(res: Response, req: Request, userDto: CreateUserDto): Promise<void>;
    addUser(res: Response, req: Request, userDto: CreateUserDto): Promise<void>;
}
