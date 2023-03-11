import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Category {
  @Prop()
  _id: string;

  @Prop()
  organizationId: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  createdAt: Date;

  updatedAt: Date;
}
