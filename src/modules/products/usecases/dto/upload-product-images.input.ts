import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UploadProductImagesInput {
  organizationId: string;

  @Field()
  productId: string;

  @Field()
  files: any[];
}
