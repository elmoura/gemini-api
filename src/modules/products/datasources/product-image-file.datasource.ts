import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Environment } from '@config/env';
import { Injectable } from '@nestjs/common';

interface IProductImageFileDataSource {
  uploadOne(fileKey: string, file: any): Promise<{ url: string }>;
}

@Injectable()
export class ProductImageFileDataSource implements IProductImageFileDataSource {
  private s3Client: S3Client;

  private bucketRegion: string;

  private bucketName: string;

  constructor() {
    this.s3Client = new S3Client({
      region: Environment.aws.s3.region,
      credentials: {
        accessKeyId: Environment.aws.accessKey,
        secretAccessKey: Environment.aws.secretKey,
      },
    });

    this.bucketName = Environment.aws.s3.bucketName;
    this.bucketRegion = Environment.aws.s3.region;
  }

  async uploadOne(fileKey: string, file: any): Promise<{ url: string }> {
    const uploadStream = new Upload({
      client: this.s3Client,
      params: {
        Key: fileKey,
        ACL: 'public-read',
        Bucket: this.bucketName,
        Body: file,
      },
    });

    await uploadStream.done();

    // https://chefin-images.s3.us-east-1.amazonaws.com/64774a3de746cfd41cef34ec/products/64b042f304df728484f61b93-1.jpeg
    const url = `https://${this.bucketName}.s3.${this.bucketRegion}.amazonaws/${fileKey}`;
    return { url };
  }
}
