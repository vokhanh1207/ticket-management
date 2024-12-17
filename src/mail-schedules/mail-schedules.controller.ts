import { Body, Controller, Delete, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { MailSchedulesService } from './mail-schedules.service';
import { Response, Request } from 'express';
import { MailScheduleDto } from './dto/mail-schedule.dto';

@Controller('mail-schedules')
export class MailSchedulesController {

    constructor(
        private mailSchedulesService: MailSchedulesService,
    ) { }

    @Post('/:eventId')
    async upsertMailSchedules(
        @Body() createMailSchedules: MailScheduleDto[] = [],
        @Req() req: Request,
        @Res() res: Response) {
        const promises = [];
        createMailSchedules
            .filter(item => !item.id)
            .forEach(item => {
                promises.push(this.mailSchedulesService.createEventMailSchedules(item))
            });
        createMailSchedules
            .filter(item => !!item.id)
            .forEach(item => {
                promises.push(this.mailSchedulesService.updateMailSchedule(item.id, item))
            });
        await Promise.all(promises);
        const schedules = await this.mailSchedulesService.getEventMailSchedules(req.params?.eventId);
        res.status(HttpStatus.OK);
        return res.json(schedules);
    }

    @Delete('/:eventId/:scheduleId')
    async deleteMailSchedule(
        @Req() req: Request,
        @Res() res: Response) { 
        await this.mailSchedulesService.deleteMailSchedule(req.params?.scheduleId);
        const schedules =  await this.mailSchedulesService.getEventMailSchedules(req.params?.eventId);
        res.status(HttpStatus.OK);
        return res.json(schedules);
    }
}
