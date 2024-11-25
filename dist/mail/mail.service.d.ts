import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
export declare class MailService {
    private readonly mailerService;
    constructor(mailerService: MailerService);
    sendMail(mailOptions: ISendMailOptions): Promise<{
        success: boolean;
    }>;
}
