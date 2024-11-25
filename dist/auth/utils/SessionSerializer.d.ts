import { AuthService } from '../auth.service';
import { User } from '../user.entity';
import { PassportSerializer } from "@nestjs/passport";
export declare class SessionSerializer extends PassportSerializer {
    private authService;
    constructor(authService: AuthService);
    serializeUser(user: User, done: Function): void;
    deserializeUser(user: User, done: Function): Promise<any>;
}
