import { forwardRef, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { MailSchedulesService } from 'src/mail-schedules/mail-schedules.service';
import { MailSchedulesRepository } from 'src/mail-schedules/mail-schedules.repository';
import { EventFileService } from './services/event-file.service';
import { AuthRedirectMiddleware } from '../auth/middleware/auth-redirect.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
    forwardRef(() => TicketsModule),
    AuthModule
  ],
  controllers: [EventsController],
  providers: [EventsService, EventsRepository, TicketsRepository, MailService, OrganizersService,
    OrganizersRepository,
    MailSchedulesService,
    EventFileService,
    MailSchedulesRepository
  ],
  exports: [EventsService]
})
export class EventsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthRedirectMiddleware)
      .forRoutes('events/:eventId/edit', 'events/:eventId/upload-banner');
  }
}
