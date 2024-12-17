import { forwardRef, Module } from '@nestjs/common';
import { MailSchedulesService } from './mail-schedules.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailSchedulesRepository } from './mail-schedules.repository';
import { MailSchedule } from './dto/mail-schedule.entity';
import { MailSchedulesController } from './mail-schedules.controller';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MailSchedule]),
    forwardRef(() => EventsModule)
  ],
  controllers: [MailSchedulesController],
  providers: [
    MailSchedulesService,
    MailSchedulesRepository
  ],
  exports: [MailSchedulesService]
})
export class MailSchedulesModule {}
 