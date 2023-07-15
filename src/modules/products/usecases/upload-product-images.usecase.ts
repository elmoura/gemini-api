import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';

/**
 * @observation
 * How to implement this:
 * https://stephen-knutter.github.io/2020-02-07-nestjs-graphql-file-upload/
 *
 * graphql-upload docs:
 * https://github.com/jaydenseric/graphql-multipart-request-spec
 */
@Injectable()
export class UploadProductImagesUseCase
  implements IBaseUseCase<void, UploadProductImagesOutput>
{
  constructor() {}

  async execute(input: void): Promise<UploadProductImagesOutput> {}
}
