import {
  Validate,
  IsString,
  MinLength,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { User } from '@modules/users/entities/user';
import { IBaseCollection } from '@shared/interfaces/base-collection';
import { IsObjectId } from '@shared/validations/is-object-id';

type AlreadySavedUserFields =
  | keyof IBaseCollection
  | 'accountStatus'
  | 'organizationId'
  | 'email';

@InputType()
export class AccountConfirmationInput
  implements Omit<User, AlreadySavedUserFields>
{
  @Field()
  @Validate(IsObjectId)
  _id: string;

  @Field()
  @IsString()
  firstName: string;

  @Field()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsPhoneNumber('BR')
  @Field({ nullable: true })
  phoneNumber: string;

  @Field()
  @IsString()
  @MinLength(8)
  password: string;
}
