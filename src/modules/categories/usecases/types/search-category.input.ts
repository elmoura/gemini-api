import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class SearchCategoryInput {
  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  limit: number;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  offset: number;

  @Field()
  @IsString()
  name: string;
}
