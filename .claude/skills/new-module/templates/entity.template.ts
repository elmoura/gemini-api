// Template: entities/__entityName__.ts
// Adaptar: nome da classe, campos @Prop() (tipos e obrigatoriedade), e adicionar
// `XSchema.index(...)` abaixo do createForClass se o módulo tiver queries frequentes
// por combinação de campos ou um campo único (ver mongodb-graphql-patterns.md).
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type __EntityName__Document = __EntityName__ & Document;

@Schema({ timestamps: true })
export class __EntityName__ {
  _id: string;

  @Prop()
  organizationId: string;

  @Prop()
  locationId: string;

  @Prop()
  isActive: boolean;

  // TODO: campos específicos da entidade (adaptar tipos/obrigatoriedade)
  @Prop()
  name: string;

  createdAt: Date;

  updatedAt: Date;
}

export const __EntityName__Schema =
  SchemaFactory.createForClass(__EntityName__);

// Exemplo de índice (descomentar/adaptar se necessário):
// __EntityName__Schema.index({ organizationId: 1, locationId: 1 });
