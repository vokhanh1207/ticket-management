import { Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

  async sendMail(mailOptions: ISendMailOptions) {
    try {
      await this.mailerService.sendMail({
        to: mailOptions.to,
        from: mailOptions.from, // sender address
        subject: mailOptions.subject, // Subject line
        html: mailOptions.html,
      });
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
      };
    }
  }
}
