import { container } from "tsyringe";

import { IMailProvider } from "./IMailProvider";
import { MailTrapMailProvider } from "./implementations/MailTrapMailProvider";
import { SESMailProvider } from "./implementations/SESMailProvider";

const providers = {
  mailtrap: container.resolve(MailTrapMailProvider),
  ses: container.resolve(SESMailProvider),
};

container.registerInstance<IMailProvider>(
  "MailProvider",
  providers[process.env.MAIL_PROVIDER]
);
