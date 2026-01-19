import { Field, ObjectType } from '@nestjs/graphql';
import { MenuObj } from './menu.object';
import { CategoryObj } from '@modules/categories/usecases/types/category.object';

@ObjectType('MenuDetails')
export class MenuDetailsObj extends MenuObj {
  @Field(() => [CategoryObj])
  categories: CategoryObj[];
}
