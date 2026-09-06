import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, Validate } from 'class-validator';
import { IsObjectId } from '@shared/validations/is-object-id';
import { ClientSourceData } from '@modules/print-jobs/decorators/client-source.decorator';

@InputType()
export class FinishOrderTabInput {
  organizationId: string;

  source?: ClientSourceData;

  @Field()
  @Validate(IsObjectId)
  orderTabId: string;

  @Field()
  @IsBoolean()
  payServiceTax: boolean;
}

@InputType()
export class FinishTableOrderInput {
  organizationId: string;

  @Field()
  @Validate(IsObjectId)
  tableOrderId: string;
}
