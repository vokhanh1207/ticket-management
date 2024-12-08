import { Body, Controller, Get, Post, Render, Req, Res, Session, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request } from 'express';
import { AuthService } from './auth/auth.service';
import { User } from './auth/user.entity';
import { AuthCredentialsDto, CreateUserDto } from './auth/dto/auth-credentials.dto';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { UserRole } from './auth/constants/user-role.constant';
import { OrganizersService } from './organizers/organizers.service';
import { CreateOrganizerDto } from './organizers/dto/create-organizer.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly organizerService: OrganizersService,

  ) { }

  @Get()
  getLandingPage(@Res() res: Response, @Req() req: Request) {
    return res.redirect('/events');
  }

  @Get('login')
  login(@Res() res: Response, @Req() req: Request) {
    if (req.user) {
      return res.redirect('/events');
    }
    return res.render('login', { user: req.user });
  }

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  async postLogin(
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

  @Get('my-profile')
  async getMyProfile(@Res() res: Response, @Req() req: Request) {
    if (!req.user) {
      return res.redirect('/events');
    }
    const user = await this.authService.findUserById((req.user as User).id);
    const organizer = await this.organizerService.getOrganizerId(user.organizerId);
    return res.render('my-profile', { user, organizer });
  }

  @Post('my-profile')
  async updateMyProfile(@Res() res: Response, @Req() req: Request, @Body() userDto: CreateUserDto) {
    const user = req.user as User;
    if (!user) {
      return res.redirect('/events');
    }

    const updatedUser = await this.authService.updateUser(userDto);
    return res.render('my-profile', { updatedUser });
  }

  @Get('add-user')
  async showAddUser(@Res() res: Response, @Req() req: Request, @Body() userDto: CreateUserDto) {
    if (!req.user) {
      return res.redirect('/events');
    }
    const organizers = await this.organizerService.getOrganizers();
    return res.render('add-user', {
      user: req.user,
      roles: Object.values(UserRole),
      organizers
    });
  }

  @Post('add-user')
  async addUser(@Res() res: Response, @Req() req: Request, @Body() userDto: CreateUserDto) {
    if (!req.user && (req.user as User).role !== UserRole.Admin) {
      return res.redirect('/events');
    }
    let message = '';
    try {
      const user = await this.authService.signUp(userDto, req.user as User);
      message = 'User created successfully';
    } catch (error) {
      message = error.message;
    }
    return res.render('add-user', { user: req.user, message });
  }
}
