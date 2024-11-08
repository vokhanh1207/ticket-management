import { Inject } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from '../user.entity';
import { UserRepository } from '../user.repository';
import { PassportSerializer } from "@nestjs/passport"

export class SessionSerializer extends PassportSerializer {
    constructor(@Inject('AUTH_SERVICE') private authService: AuthService) {
        super();
    }

    serializeUser(user: User, done: Function) {
        done(null, user);
    }
    async deserializeUser(user: User, done: Function) {
        const userDB = await this.authService.findUserById(user.id);

        return userDB ? done(null, userDB) : done(null, null)
    }
}