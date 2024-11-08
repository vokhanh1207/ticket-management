import { Controller, Get, Render, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request } from 'express';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService
  ) { }

  @Get()
  getLandingPage(@Res() res: Response, @Req() req: Request) {
    return res.redirect('/events');
  }

  @Get('login')
  login(@Res() res: Response, @Req() req: Request) {
    return res.render('login', { user: req.user });
  }
}
