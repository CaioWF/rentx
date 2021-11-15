import { inject, injectable } from "tsyringe";
import { v4 as uuid } from "uuid";

import auth from "@config/auth";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { AppError } from "@shared/errors/AppError";

@injectable()
class SendForgotPasswordMailUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository,
    @inject("DateProvider")
    private dateProvider: IDateProvider,
    @inject("MailProvider")
    private mailProvider: IMailProvider
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) throw new AppError("User does not exists");

    const token = uuid();

    const expiresDate = this.dateProvider.addHours(
      auth.expires_in_reset_token_hours
    );

    await this.usersTokensRepository.create({
      expires_date: expiresDate,
      refresh_token: token,
      user_id: user.id,
    });

    await this.mailProvider.sendMail(
      email,
      "Reset password",
      `O link para o reset é ${token}`
    );
  }
}

export { SendForgotPasswordMailUseCase };
