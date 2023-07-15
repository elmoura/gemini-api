import { ProductImage } from '@modules/products/entities/product-image';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
class Image implements ProductImage {
  @Field()
  _id: string;

  @Field()
  productId: string;

  @Field()
  fileName: string;

  @Field()
  url: string;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}

@ObjectType()
export class UploadProductImagesOutput {
  @Field(() => [Image])
  results: Image[];
}
