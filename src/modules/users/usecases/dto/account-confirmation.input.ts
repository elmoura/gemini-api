import {
  IsString,
  MinLength,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { User } from '@modules/users/entities/user';

@InputType()
export class AccountConfirmationInput
  implements Pick<User, 'firstName' | 'lastName' | 'phoneNumber' | 'password'>
{
  @Field()
  @IsString()
  token: string;

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
