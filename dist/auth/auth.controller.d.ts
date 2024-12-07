import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { Response, Request } from 'express';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(body: AuthCredentialsDto, res: Response, req: Request, session: any): Promise<void>;
    logout(req: Request, res: Response): Promise<void>;
}
