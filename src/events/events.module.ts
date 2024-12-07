import { forwardRef, Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsRepository } from './events.repository';
import { TicketsModule } from 'src/tickets/tickets.module';
import { AuthModule } from 'src/auth/auth.module';
import { TicketsRepository } from 'src/tickets/tickets.repository';
import { MailService } from 'src/mail/mail.service';
import { OrganizersService } from 'src/organizers/organizers.service';
import { OrganizersRepository } from 'src/organizers/organizers.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
    forwardRef(() => TicketsModule),
    AuthModule
  ],
  controllers: [EventsController],
  providers: [EventsService, EventsRepository, TicketsRepository, MailService, OrganizersService, OrganizersRepository],
  exports: [EventsService]
})
export class EventsModule {}
 