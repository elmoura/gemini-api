import { v4 as uuid } from 'uuid';
import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { UploadFilesInput } from './dto/upload-files-input';
import { UploadFilesOutput } from './dto/upload-files-output';
import { Buckets, UploadService } from '@shared/services/upload.service';

@Injectable()
export class UploadFilesUseCase
  implements IBaseUseCase<UploadFilesInput, UploadFilesOutput>
{
  constructor(private uploadService: UploadService) {}

  async execute(input: UploadFilesInput): Promise<UploadFilesOutput> {
    const { organizationId } = input;

    console.log(input);

    const uploadedFiles = await Promise.all(
      input.files.map((file) => {
        const splittedFileName = file.originalname.split('.');
        const fileExtension = splittedFileName[splittedFileName.length - 1];

        const key = `${organizationId}/tmp/${uuid()}.${fileExtension}`;

        return this.uploadService.uploadFile({
          file,
          key,
          bucket: Buckets.files,
        });
      }),
    );

    return {
      success: true,
      items: uploadedFiles,
    };
  }
}
