import { sign, verify } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import auth from "@config/auth";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IPayload {
  sub: string;
  email: string;
}

@injectable()
class RefresTokenUseCase {
  constructor(
    @inject("UsersTokensRepository")
    private usersTokenRepository: IUsersTokensRepository,
    @inject("DateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute(token: string): Promise<string> {
    const { email, sub } = verify(token, auth.secret_refresh_token) as IPayload;

    const userToken =
      await this.usersTokenRepository.findByUserIdAndRefreshToken(sub, token);

    if (!userToken) throw new AppError("Refresh Token does not exists");

    await this.usersTokenRepository.deleteById(userToken.id);

    const refreshToken = sign({ email }, auth.secret_refresh_token, {
      subject: sub,
      expiresIn: auth.expires_in_refresh_token,
    });

    const expiresDate = this.dateProvider.addDays(
      auth.expires_in_refresh_token_days
    );

    await this.usersTokenRepository.create({
      expires_date: expiresDate,
      refresh_token: refreshToken,
      user_id: sub,
    });

    return refreshToken;
  }
}

export { RefresTokenUseCase };
