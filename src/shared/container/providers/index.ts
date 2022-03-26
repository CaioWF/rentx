import { container } from "tsyringe";

import { IDateProvider } from "./DateProvider/IDateProvider";
import { DayjsDateProvider } from "./DateProvider/implementations/DayjsDateProvider";
import { IMailProvider } from "./MailProvider/IMailProvider";
import { MailTrapMailProvider } from "./MailProvider/implementations/MailTrapMailProvider";
import { LocalStorageProvider } from "./StorageProvider/implementations/LocalStorageProvider";
import { S3StorageProvider } from "./StorageProvider/implementations/S3StorageProvider";
import { IStorageProvider } from "./StorageProvider/IStorageProvider";

container.registerSingleton<IDateProvider>("DateProvider", DayjsDateProvider);

container.registerInstance<IMailProvider>(
  "MailProvider",
  new MailTrapMailProvider()
);
const stogare = {
  local: LocalStorageProvider,
  cloud: S3StorageProvider,
};
container.registerSingleton<IStorageProvider>(
  "StorageProvider",
  stogare[process.env.STORAGE_PROVIDER]
);
