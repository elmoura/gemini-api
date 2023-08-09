import { Field, ObjectType } from '@nestjs/graphql';
import { Customer } from '@modules/customers/entities/customer';

@ObjectType()
export class CustomerObj implements Omit<Customer, 'password'> {
  @Field()
  _id: string;

  @Field()
  organizationId: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  phone: string;

  @Field()
  updatedAt: Date;

  @Field()
  createdAt: Date;
}
