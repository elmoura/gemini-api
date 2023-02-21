import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateOrganizationInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsEmail()
  representantEmail: string;

  @Field()
  @IsOptional()
  @IsString()
  businessSegment: string;
}
