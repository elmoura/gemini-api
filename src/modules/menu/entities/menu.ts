import { Category } from '@modules/categories/entities/category';
import { Product } from '@modules/products/entities/product';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MenuTypes } from '../enums/menu-types';

export type MenuDocument = Menu & Document;

type CategoryWithProducts = Category & {
  products: Product[];
};

@Schema({ timestamps: true })
export class Menu {
  _id: string;

  @Prop()
  organizationId: string;

  @Prop()
  locationId: string;

  @Prop()
  type: MenuTypes[];

  @Prop()
  isActive: boolean;

  @Prop()
  name: string;

  @Prop()
  description?: string;

  @Prop()
  categoryIds: string[];

  categories?: CategoryWithProducts[];

  createdAt: Date;

  updatedAt: Date;
}

export const MenuSchema = SchemaFactory.createForClass(Menu);
