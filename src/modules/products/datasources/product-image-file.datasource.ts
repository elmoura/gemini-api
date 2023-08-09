import { Stream } from 'stream';
import { Injectable } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Environment } from '@config/env';

export interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Stream;
}

interface IProductImageFileDataSource {
  uploadOne(fileKey: string, file: FileUpload): Promise<{ url: string }>;
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

  async uploadOne(fileKey: string, file: FileUpload): Promise<{ url: string }> {
    let fileString = '';

    file
      .createReadStream()
      .on('data', (fileChunk) => {
        console.log(
          'chunk length =>',
          fileChunk.length,
          'chunk type =>',
          typeof fileChunk,
        );

        fileString += fileChunk;
      })
      .on('end', async () => {
        const uploadStream = new Upload({
          client: this.s3Client,
          params: {
            Key: fileKey,
            ACL: 'public-read',
            Bucket: this.bucketName,
            Body: fileString,
          },
        });

        await uploadStream.done();
      });

    // https://chefin-images.s3.us-east-1.amazonaws.com/64774a3de746cfd41cef34ec/products/64b042f304df728484f61b93-1.jpeg
    const url = `https://${this.bucketName}.s3.${this.bucketRegion}.amazonaws/${fileKey}`;
    return { url };
  }
}
