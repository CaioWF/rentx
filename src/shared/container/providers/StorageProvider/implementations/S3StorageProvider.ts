import { S3 } from "aws-sdk";
import fs from "fs";
import mime from "mime";
import { resolve } from "path";

import upload from "@config/upload";

import { IStorageProvider } from "../IStorageProvider";

class S3StorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new S3({
      region: process.env.AWS_DEFAULT_REGION,
    });
  }

  async save(file: string, folder: string): Promise<string> {
    const originalPath = resolve(upload.tmpFolder, file);

    const fileContent = await fs.promises.readFile(originalPath);

    await this.client
      .putObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${folder}/${file}`,
        ACL: "public-read",
        Body: fileContent,
        ContentType: mime.getType(originalPath),
      })
      .promise();

    await fs.promises.unlink(originalPath);

    return file;
  }

  async delete(file: string, folder: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${folder}/${file}`,
      })
      .promise();
  }
}

export { S3StorageProvider };
