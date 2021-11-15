import nodemailer, { Transporter } from "nodemailer";

import { IMailProvider } from "../IMailProvider";

class MailTrapMailProvider implements IMailProvider {
  private client: Transporter;

  constructor() {
    this.client = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "b85417b77e72ab",
        pass: "7a36068d278e6d",
      },
    });
  }

  async sendMail(to: string, subject: string, body: string): Promise<void> {
    const message = await this.client.sendMail({
      to,
      from: "Rentx <no-reply@rentx.com.br>",
      subject,
      text: body,
      html: body,
    });

    console.info("Message: %s", JSON.stringify(message, null, 2));
  }
}

export { MailTrapMailProvider };
