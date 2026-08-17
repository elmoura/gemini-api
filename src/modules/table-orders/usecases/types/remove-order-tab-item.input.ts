import { Field, InputType } from '@nestjs/graphql';
import { IsObjectId } from '@shared/validations/is-object-id';
import { IsInt, IsOptional, Validate } from 'class-validator';
import { ClientSourceData } from '@modules/print-jobs/decorators/client-source.decorator';

@InputType()
export class RemoveOrderTabItemInput {
  @Field()
  @Validate(IsObjectId)
  orderTabId: string;

  @Field()
  @Validate(IsObjectId)
  itemId: string;

  @IsInt()
  @IsOptional()
  @Field({ nullable: true })
  quantity?: number;

  organizationId: string;

  source?: ClientSourceData;
}

@InputType()
export class RemoveTableOrderItemInput {
  @Field()
  @Validate(IsObjectId)
  tableOrderId: string;

  @Field()
  @Validate(IsObjectId)
  itemId: string;

  @IsInt()
  @IsOptional()
  @Field({ nullable: true })
  quantity?: number;

  organizationId: string;
}
