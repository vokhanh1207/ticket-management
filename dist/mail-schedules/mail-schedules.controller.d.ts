import { MailSchedulesService } from './mail-schedules.service';
import { Response, Request } from 'express';
import { MailScheduleDto } from './dto/mail-schedule.dto';
export declare class MailSchedulesController {
    private mailSchedulesService;
    constructor(mailSchedulesService: MailSchedulesService);
    upsertMailSchedules(createMailSchedules: MailScheduleDto[], req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteMailSchedule(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
