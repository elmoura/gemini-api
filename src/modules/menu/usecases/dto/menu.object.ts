import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { MenuTypes } from '@modules/menu/enums/menu-types';
import { Menu } from '@modules/menu/entities/menu';

registerEnumType(MenuTypes, { name: 'MenuTypes' });

@ObjectType()
export class MenuObj implements Partial<Omit<Menu, 'categories'>> {
  @Field()
  _id: string;

  @Field({ nullable: true })
  isActive?: boolean;

  @Field()
  locationId: string;

  @Field(() => [MenuTypes])
  types: MenuTypes[];

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [String], { nullable: true })
  categoryIds?: string[];
}
