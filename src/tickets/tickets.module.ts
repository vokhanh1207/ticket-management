import { ConfigService } from '@nestjs/config';
import { forwardRef, Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './dto/ticket.entity';
import { EventsModule } from 'src/events/events.module';
import { EventsService } from 'src/events/events.service';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket]),
    forwardRef(() => EventsModule)
  ],
  controllers: [TicketsController],
  providers: [TicketsService, ConfigService, MailService],
  exports: [TicketsService]
})
export class TicketsModule {}
