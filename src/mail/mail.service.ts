import { Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

  async sendMail(mailOptions: ISendMailOptions) {
    try {
      // for using template: https://stackoverflow.com/questions/56390245/how-to-register-handlebars-intl-helper-in-nestjs-mailer
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
