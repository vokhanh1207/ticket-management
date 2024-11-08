import { Body, Controller, Get, Inject, Post, Req, Res, Session, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto, CreateUserDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { LocalAuthGuard } from './local-auth.guard';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {
    constructor(@Inject('AUTH_SERVICE') private authService: AuthService) { }

    @Post('/signup')
    async signUp(@Body() createUserDto: CreateUserDto): Promise<void> {
        return this.authService.signUp(createUserDto);
    }

    @Post('/login')
    @UseGuards(LocalAuthGuard)
    async login(
        @Body() body: AuthCredentialsDto, 
        @Res() res: Response, 
        @Req() req: Request,
        @Session() session
    ) {
        const user = await this.authService.signIn(body);
        if (user) {
            session.userId = user.id;
            return res.redirect('../events');
        } else {
            return res.render('login', {message: 'Username or password is incorrect', user: req.user});
        }
    }

    @Get('/logout')
    async logout(@Req() req: Request, @Res() res: Response) {
        req.logout(() => { });
        return res.redirect('../events');
    }
}
