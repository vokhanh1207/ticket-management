import { Body, Controller, Get, Post, Req, Res, Headers } from '@nestjs/common';
import { Response, Request } from 'express';
import { CreateTicketDto } from 'src/tickets/dto/create-ticket.dto';
import * as moment from 'moment'
import { OrganizersService } from './organizers.service';
import { User } from 'src/auth/user.entity';
import { UserRole } from 'src/auth/constants/user-role.constant';
import { CreateOrganizerDto } from './dto/create-organizer.dto';

@Controller('organizers')
export class OrganizersController {

    constructor(
        private organizersService: OrganizersService
    ) { }

    @Get()
    async showOrganizers(
        @Res() res: Response,
        @Req() req: Request) {
        if (!req.user && (req.user as User)?.role !== UserRole.Admin && (req.user as User)?.role !== UserRole.Admin) {
            return res.render('forbidden');
        }
        try {
            const organizers = await this.organizersService.getOrganizers();
            return res.render('organizers', { user: req.user, organizers }); 
        } catch (error) {
            console.log(error)
        }
    }

    @Get('new')
    showNewOrganizer(
        @Res() res: Response,
        @Req() req: Request) {
        if (!req.user || (req.user as User)?.role !== UserRole.Admin) {
            return res.render('forbidden');
        }
        return res.render('organizer-create-edit', { user: req.user });
    }

    @Post('new')
    async newOrganizer(
        @Res() res: Response,
        @Req() req: Request,
        @Body() createOrganizerDto: CreateOrganizerDto,) {
        if (!req.user || (req.user as User)?.role !== UserRole.Admin) {
            return res.render('forbidden');
        }
        try {
            const organizer = await this.organizersService.createOrganizer(createOrganizerDto);
            return res.render('organizer-create-edit', { user: req.user, organizer }); 
        } catch (error) {
            console.log(error)
        }
    }


    @Get(':organizerId')
    async getOrganizer(@Res() res: Response, @Req() req: Request) {
        const organizerId = req.params?.organizerId;
        const organizer = await this.organizersService.getOrganizerId(req.params?.organizerId);
        if (!organizer) {
            return res.render('not-found', { user: req.user });
        }
        
        return res.render('organizer', { organizer, user: req.user });
    }

    @Post(':organizerId')
    async updateMyOrganization(@Res() res: Response, @Req() req: Request, @Body() createOrganizerDto: CreateOrganizerDto) {
        const organizerId = req.params?.organizerId;
        if (!req.user) {
            return res.redirect(`/organizers/${organizerId}`);
        }
        const user = req.user as User;
        if (user && 
            user?.role === UserRole.Admin ||
            (user?.role === UserRole.OrganizerAdmin && user.organizerId === organizerId)
        ) {
            await this.organizersService.updateOrganizers((req.user as User).organizerId, createOrganizerDto);
        }
        return res.redirect(`/organizers/${organizerId}`);
    }

    @Get(':organizerId/edit')
    async getEvent(@Res() res: Response, @Req() req: Request) {
        const organizerId = req.params?.organizerId;
        const organizer = await this.organizersService.getOrganizerId(req.params?.organizerId);
        let manageable = false;
        if (!organizer) {
            return res.render('not-found', { user: req.user });
        }
        const user = req.user as User;
        if (user && 
            user?.role === UserRole.Admin ||
            (user?.role === UserRole.OrganizerAdmin && user.organizerId === organizerId)
        ) {
            return res.render('organizer-create-edit', { organizer, user: req.user, manageable });
        }

        return res.redirect(`/organizers/${organizerId}`); 
    }
}
