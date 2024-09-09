import { Menu } from '@modules/menu/entities/menu';
import { MenuTypes } from '@modules/menu/enums/menu-types';
import { Field, InputType } from '@nestjs/graphql';
import { AutoGeneratedFields } from '@shared/interfaces/auto-generated-fields';
import { IsObjectId } from '@shared/validations/is-object-id';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';

@InputType()
export class CreateMenuInput
  implements
    Omit<Menu, AutoGeneratedFields | 'categories' | 'categoryIds' | 'isActive'>
{
  organizationId: string;

  locationId: string;

  @Field(() => MenuTypes)
  @IsEnum(MenuTypes)
  type: MenuTypes[];

  @Field()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @Field()
  @IsString()
  name: string;

  @Field()
  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @IsOptional()
  @Field({ nullable: true })
  @Validate(IsObjectId, { each: true })
  categoryIds?: string[];
}
