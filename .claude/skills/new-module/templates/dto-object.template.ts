// Template: usecases/dto/__entity-name__.object.ts
// Output GraphQL correspondente à entity. Adaptar campos e o `implements Omit<...>`
// para excluir campos que não devem ir para o cliente (ex.: organizationId, se
// multi-tenant não deve vazar isso no payload).
import { Field, ObjectType } from '@nestjs/graphql';
import { __EntityName__ } from '@modules/__module-folder__/entities/__entityName__';

@ObjectType('__EntityName__')
export class __EntityName__Obj implements Omit<__EntityName__, 'organizationId'> {
  @Field()
  _id: string;

  @Field({ nullable: true })
  isActive: boolean;

  @Field()
  locationId: string;

  @Field()
  name: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
