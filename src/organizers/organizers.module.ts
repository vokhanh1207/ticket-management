import { forwardRef, Module } from '@nestjs/common';
import { OrganizersController } from './organizers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { MailService } from 'src/mail/mail.service';
import { Organizer } from './dto/organizer.entity';
import { OrganizersRepository } from './organizers.repository';
import { OrganizersService } from './organizers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organizer]),
    // forwardRef(() => TicketsModule),
    AuthModule
  ],
  controllers: [OrganizersController],
  providers: [OrganizersRepository, OrganizersService, MailService],
  exports: []
})
export class OrganizersModule {}
