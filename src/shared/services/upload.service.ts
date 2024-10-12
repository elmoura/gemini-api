import { Readable } from 'stream';
import { Environment } from '@config/env';
import { Upload } from '@aws-sdk/lib-storage';
import {
  S3Client,
  CopyObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import {
  MoveFileParams,
  MoveFileResult,
  UploadFileParams,
  UploadFileResult,
} from './types/upload-service.dto';

export const Buckets = {
  files: `chefin-files-${Environment.env}`,
};

export class UploadService {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: Environment.aws.region,
      credentials: {
        accessKeyId: Environment.aws.accessKeyId,
        secretAccessKey: Environment.aws.secretAccessKey,
      },
    });
  }

  async uploadFile({
    file,
    bucket,
    key,
  }: UploadFileParams): Promise<UploadFileResult> {
    const upload = new Upload({
      client: this.s3Client,
      params: {
        Bucket: bucket,
        Key: key,
        Body: Readable.from(file.buffer),
        ContentType: file.mimetype,
      },
    });

    await upload.done();

    const { url } = this.formatUrl(bucket, key);

    return {
      bucket,
      key,
      url,
    };
  }

  async moveFile(params: MoveFileParams): Promise<MoveFileResult> {
    console.log(params);
    const copyCommand = new CopyObjectCommand({
      Bucket: params.toBucket,
      Key: params.toKey,
      CopySource: encodeURIComponent(`${params.fromBucket}/${params.fromKey}`),
    });

    await this.s3Client.send(copyCommand);

    const deleteCommand = new DeleteObjectCommand({
      Bucket: params.fromBucket,
      Key: params.fromKey,
    });

    await this.s3Client.send(deleteCommand);

    const newUrl = this.formatUrl(params.toBucket, params.toKey).url;

    return {
      newUrl,
      newFileKey: params.toKey,
    };
  }

  public getFileKeyFromUrl(url: string): { key: string } {
    const splittedUrl = url.split('amazonaws.com/');
    const key = splittedUrl[splittedUrl.length - 1];
    console.log({ key });
    return { key };
  }

  private formatUrl(bucket: string, key: string): { url: string } {
    const url = `https://${bucket}.s3.${Environment.aws.region}.amazonaws.com/${key}`;
    return { url };
  }
}
