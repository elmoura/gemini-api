import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CategoryObj } from '@modules/categories/usecases/types/category.object';
import { ProductObj } from '@modules/products/usecases/dto/product.object';
import { MenuTypes } from '@modules/menu/enums/menu-types';
import { Menu } from '@modules/menu/entities/menu';

registerEnumType(MenuTypes, { name: 'MenuTypes' });

@ObjectType()
class CategoryWithProducts extends CategoryObj {
  @Field()
  _id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  productIds: string[];

  @Field(() => [ProductObj], { nullable: true })
  products: ProductObj[];
}

@ObjectType()
export class MenuObj implements Partial<Omit<Menu, 'categories'>> {
  @Field()
  _id: string;

  @Field({ nullable: true })
  isActive?: boolean;

  @Field()
  locationId: string;

  @Field(() => [MenuTypes])
  type: MenuTypes[];

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [CategoryWithProducts])
  categories: CategoryWithProducts[];
}
