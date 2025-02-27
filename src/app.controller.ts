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
import { OrganizationAdminGuard } from './users/guards/organization-admin.guard';
import { ScannerGuard } from './auth/guards/scanner.guard';

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
    return res.render('my-profile', { user: updatedUser });
  }

  @Get('scan')
  @UseGuards(ScannerGuard)
  async showScanPage(@Res() res: Response, @Req() req: Request) {
    return res.render('scan', { 
        user: req.user,
        active: 'scan'  // Add active state
    });
  }
}
