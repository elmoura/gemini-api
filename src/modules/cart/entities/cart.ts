import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CartItem } from './cart-item';

export type CartDocument = Cart & Document;

@Schema({ timestamps: true })
export class Cart {
  _id: string;

  // em que mesa esse carrinho esta sendo servido?
  // criar ligaçao com mesa pro fluxo presencial

  @Prop()
  organizationId: string;

  @Prop()
  customerId: string;

  // @obs: json aqui
  @Prop()
  items: CartItem[];

  createdAt: Date;

  updatedAt: Date;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
