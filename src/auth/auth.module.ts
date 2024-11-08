import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { SessionSerializer } from './utils/SessionSerializer';

@Module({
    imports: [
        TypeOrmModule.forFeature([User])
    ],
    controllers: [AuthController],
    providers: [{
        provide: 'AUTH_SERVICE',
        useClass: AuthService
    }, UserRepository, LocalStrategy, SessionSerializer],
    exports: [LocalStrategy]
})
export class AuthModule {}
