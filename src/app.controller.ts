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
    return res.render('my-profile', { user: updatedUser });
  }

  @Get('add-user')
  async showAddUser(@Res() res: Response, @Req() req: Request, @Body() userDto: CreateUserDto) {
    if (!req.user && (req.user as User)?.role !== UserRole.ADMIN && (req.user as User)?.role !== UserRole.ORGANIZER_ADMIN) {
      return res.redirect('/events');
    }
    const organizers = await this.organizerService.getOrganizers();
    let roles = Object.values(UserRole);

    if ((req.user as User).role === UserRole.ORGANIZER_ADMIN) {
      roles = roles.filter(item => item !== UserRole.ADMIN);
    }

    return res.render('user-form', {  // Changed from add-user to user-form
      user: req.user,
      roles,
      organizers
    });
  }

  @Post('add-user')
  async addUser(@Res() res: Response, @Req() req: Request, @Body() userDto: CreateUserDto) {
    if (!req.user) {
      return res.redirect('/events');
    }
    const currentUser = req.user as User;
    
    try {
        // For ORGANIZER_ADMIN, automatically set organizerId from current user
        if (currentUser.role === UserRole.ORGANIZER_ADMIN) {
            if (userDto.role === UserRole.ADMIN) {
                throw new Error('You are not allowed to assign the admin role to a user.');
            }
            userDto.organizerId = currentUser.organizerId;
        }

        const user = await this.authService.signUp(userDto, currentUser);
        return res.render('user-form', {  // Changed from add-user to user-form
            user: currentUser, 
            message: 'User created successfully',
            roles: Object.values(UserRole).filter(role => 
                currentUser.role === UserRole.ADMIN || role !== UserRole.ADMIN
            ),
            organizers: currentUser.role === UserRole.ADMIN ? 
                await this.organizerService.getOrganizers() : []
        });
    } catch (error) {
        return res.render('user-form', {  // Changed from add-user to user-form
            user: currentUser, 
            message: error.message,
            roles: Object.values(UserRole).filter(role => 
                currentUser.role === UserRole.ADMIN || role !== UserRole.ADMIN
            ),
            organizers: currentUser.role === UserRole.ADMIN ? 
                await this.organizerService.getOrganizers() : []
        });
    }
  }
}
