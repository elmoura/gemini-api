import { S3Client } from '@aws-sdk/client-s3';
import { Environment } from '@config/env';
import { Injectable } from '@nestjs/common';

interface IProductImageFileDataSource {
  uploadOne(file: any): Promise<boolean>;
}

@Injectable()
export class ProductImageFileDataSource implements IProductImageFileDataSource {
  private readonly allowEmptyFiles = false;

  private readonly maxFileSize = 30 * 1024 * 1024; // 30 MBs converted to bytes

  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: Environment.aws.s3.region,
      credentials: {
        accessKeyId: Environment.aws.accessKey,
        secretAccessKey: Environment.aws.secretKey,
      },
    });
  }

  async uploadOne(file: any): Promise<boolean> {}
}
