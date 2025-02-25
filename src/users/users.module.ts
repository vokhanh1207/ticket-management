import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from '../auth/auth.module';
import { OrganizersModule } from '../organizers/organizers.module';
import { OrganizersService } from '../organizers/organizers.service';
import { Organizer } from '../organizers/dto/organizer.entity';
import { OrganizersRepository } from '../organizers/organizers.repository';
import { AuthService } from '../auth/auth.service';
import { UserRepository } from '../auth/user.repository';
import { AuthMiddleware } from '../auth/middleware/auth.middleware';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Organizer]),
        AuthModule,
        OrganizersModule
    ],
    controllers: [UsersController],
    providers: [
        UsersService,
        OrganizersService,
        OrganizersRepository,
        AuthService,
        UserRepository
    ],
    exports: [UsersService]
})
export class UsersModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .forRoutes('users');
    }
}
