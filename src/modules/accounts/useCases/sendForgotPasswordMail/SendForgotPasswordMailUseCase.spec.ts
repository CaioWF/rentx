import { UsersRepositoryInMemory } from "@modules/accounts/repositories/inMemory/UsersRepositoryInMemoy";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/inMemory/UsersTokensRepositoryInMemory";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { MailProviderInMemory } from "@shared/container/providers/MailProvider/inMemory/MailProviderInMemory";
import { AppError } from "@shared/errors/AppError";

import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase";

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let usersRepositoryInMemory: IUsersRepository;
let usersTokensRepositoryInMemory: IUsersTokensRepository;
let dateProvider: IDateProvider;
let mailProvider: IMailProvider;

describe("Send Forgot Mail", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    mailProvider = new MailProviderInMemory();
    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider,
      mailProvider
    );
  });
  it("should be able to send forgot password mail to user", async () => {
    const sendMailSpy = jest.spyOn(mailProvider, "sendMail");

    await usersRepositoryInMemory.create({
      driver_license: "721738",
      email: "forgot@mail.com",
      name: "forgot",
      password: "pass",
    });

    await sendForgotPasswordMailUseCase.execute("forgot@mail.com");

    expect(sendMailSpy).toHaveBeenCalled();
  });

  it("should not be able to send an email if user does not exists", async () => {
    await expect(
      sendForgotPasswordMailUseCase.execute("nonexistent@mail.com")
    ).rejects.toEqual(new AppError("User does not exists"));
  });

  it("should be able to create a new user token", async () => {
    const createUserTokenSpy = jest.spyOn(
      usersTokensRepositoryInMemory,
      "create"
    );

    await usersRepositoryInMemory.create({
      driver_license: "456181",
      email: "forgot2@mail.com",
      name: "forgot2",
      password: "pass",
    });

    await sendForgotPasswordMailUseCase.execute("forgot2@mail.com");

    expect(createUserTokenSpy).toBeCalled();
  });
});
