import { container } from "tsyringe";

import { LocalStorageProvider } from "./implementations/LocalStorageProvider";
import { S3StorageProvider } from "./implementations/S3StorageProvider";
import { IStorageProvider } from "./IStorageProvider";

const providers = {
  local: LocalStorageProvider,
  cloud: S3StorageProvider,
};

container.registerSingleton<IStorageProvider>(
  "StorageProvider",
  providers[process.env.STORAGE_PROVIDER]
);
