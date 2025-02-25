import { Controller, Get, Post, Delete, Param, Body, Req, Res, UseGuards, HttpStatus, ForbiddenException } from '@nestjs/common';
import { Response, Request } from 'express';
import { UsersService } from './users.service';
import { User } from '../auth/user.entity';
import { UserRole } from '../auth/constants/user-role.constant';
import { AdminGuard } from './guards/admin.guard';
import { OrganizationAdminGuard } from './guards/organization-admin.guard';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from '../auth/dto/auth-credentials.dto';

@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService
    ) {}

    @Get()
    @UseGuards(OrganizationAdminGuard)
    async showUsers(@Res() res: Response, @Req() req: Request) {
        const currentUser = req.user as User;
        try {
            const users = currentUser.role === UserRole.ADMIN ?
                await this.usersService.getAllUsers() :
                await this.usersService.getUsersByOrganizerId(currentUser.organizerId);

            return res.render('users', { 
                users, 
                user: currentUser,
                canManageAdmins: currentUser.role === UserRole.ADMIN 
            });
        } catch (error) {
            console.error(error);
            return res.render('error', { message: 'Failed to load users' });
        }
    }

    @Get('new')
    @UseGuards(OrganizationAdminGuard)
    async showNewUser(@Res() res: Response, @Req() req: Request) {
        const currentUser = req.user as User;
        const roles = Object.values(UserRole)
            .filter(role => currentUser.role === UserRole.ADMIN || role !== UserRole.ADMIN);

        return res.render('user-form', {
            user: currentUser,
            roles,
            organizers: currentUser.role === UserRole.ADMIN ? 
                await this.usersService.getAllOrganizers() : []
        });
    }

    @Post('new')
    @UseGuards(OrganizationAdminGuard)
    async createUser(@Body() createUserDto: CreateUserDto, @Req() req: Request, @Res() res: Response) {
        try {
            const user = await this.authService.signUp(createUserDto, req.user as User);
            return res.status(HttpStatus.CREATED).json({
                message: "User created successfully",
                data: user
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: error.message
            });
        }
    }

    @Get(':id/edit')
    @UseGuards(OrganizationAdminGuard)
    async showEditUser(
        @Param('id') id: string,
        @Res() res: Response, 
        @Req() req: Request
    ) {
        if (!req.user) {
            return res.render('forbidden');
        }

        try {
            const userToEdit = await this.usersService.findUserWithOrganizerById(id);
            const currentUser = req.user as User;
            
            // Only allow editing if admin or same organization
            if (currentUser.role !== UserRole.ADMIN && 
                userToEdit.organizerId !== currentUser.organizerId) {
                return res.render('forbidden');
            }

            const roles = Object.values(UserRole)
                .filter(role => currentUser.role === UserRole.ADMIN || role !== UserRole.ADMIN);

            const organizers = currentUser.role === UserRole.ADMIN ? 
                await this.usersService.getAllOrganizers() : [];

            return res.render('user-form', {
                userToEdit,
                user: currentUser,
                roles,
                organizers
            });
        } catch (error) {
            if (error instanceof ForbiddenException) {
                return res.render('forbidden');
            }
            console.error(error);
            return res.render('error', { message: 'Failed to load user' });
        }
    }

    @Post(':id/edit')
    @UseGuards(OrganizationAdminGuard)
    async editUser(
        @Param('id') id: string,
        @Body() updateUserDto: CreateUserDto,
        @Res() res: Response,
        @Req() req: Request
    ) {
        if (!req.user) {
            return res.render('forbidden');
        }

        try {
            const updatedUser = await this.usersService.updateUser(id, updateUserDto);
            return res.redirect('/users');
        } catch (error) {
            return res.render('error', { message: 'Failed to update user' });
        }
    }

    @Delete(':id')
    @UseGuards(OrganizationAdminGuard)
    async deleteUser(
        @Param('id') id: string, 
        @Res() res: Response,
        @Req() req: Request
    ) {
        try {
            const userToDelete = await this.usersService.findUserById(id);
            const currentUser = req.user as User;

            // Check if user has permission to delete
            if (currentUser.role !== UserRole.ADMIN && 
                (userToDelete.organizerId !== currentUser.organizerId || 
                 userToDelete.role === UserRole.ADMIN)) {
                throw new ForbiddenException('You do not have permission to delete this user');
            }

            await this.usersService.deleteUser(id);
            return res.status(HttpStatus.OK).json({
                message: "User deleted successfully"
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: error.message
            });
        }
    }
}
