import { Injectable } from '@nestjs/common';
import { Environment } from '@config/env';
import { SendMailOptions, Transporter, createTransport } from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly transporter: Transporter;

  private readonly emailAddress: string;

  constructor() {
    this.emailAddress = Environment.email.user;

    this.transporter = createTransport({
      service: 'gmail',
      auth: {
        user: this.emailAddress,
        pass: Environment.email.password,
      },
    });
  }

  async sendMail(params: SendMailOptions): Promise<any> {
    return this.transporter.sendMail({
      ...params,
      from: this.emailAddress,
    });
  }
}
