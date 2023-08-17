import { Field, InputType } from '@nestjs/graphql';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import { FileUpload } from '@modules/products/datasources/product-image-file.datasource';

@InputType()
export class UploadProductImagesInput {
  @Field()
  productId: string;

  @Field(() => GraphQLUpload)
  files: Promise<FileUpload>[];
}
