import { Body, Controller, Get, Post, Render, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request } from 'express';
import { AuthService } from './auth/auth.service';
import { User } from './auth/user.entity';
import { CreateUserDto } from './auth/dto/auth-credentials.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService
  ) { }

  @Get()
  getLandingPage(@Res() res: Response, @Req() req: Request) {
    return res.redirect('/events');
  }

  @Get('login')
  login(@Res() res: Response, @Req() req: Request) {
    return res.render('login', { user: req.user });
  }

  @Get('my-profile')
  async getMyProfile(@Res() res: Response, @Req() req: Request) {
    if (!req.user) {
      return res.redirect('/events');
    }
    const user = await this.authService.findUserById((req.user as User).id)
    return res.render('my-profile', { user });
  }

  @Post('my-profile')
  async updateMyProfile(@Res() res: Response, @Req() req: Request, @Body() userDto: CreateUserDto) {
    if (!req.user) {
      return res.redirect('/events');
    }
    const user = await this.authService.updateUser(userDto)
    return res.render('my-profile', { user });
  }

  @Get('add-user')
  async showAddUser(@Res() res: Response, @Req() req: Request, @Body() userDto: CreateUserDto) {
    if (!req.user) {
      return res.redirect('/events');
    }
    return res.render('add-user');
  }

  @Post('add-user')
  async addUser(@Res() res: Response, @Req() req: Request, @Body() userDto: CreateUserDto) {
    if (!req.user) {
      return res.redirect('/events');
    }
    let message = '';
    try {
      const user = await this.authService.signUp(userDto);
      message = 'User created successfully';
    } catch (error) {
      message = error.message;
    }
    return res.render('add-user', { message });
  }
}
