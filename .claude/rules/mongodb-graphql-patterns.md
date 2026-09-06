---
paths:
  - "src/modules/**/entities/**"
  - "src/modules/**/datasources/**"
  - "src/modules/**/*.resolver.ts"
  - "src/modules/**/*.module.ts"
---

# Padrões MongoDB e GraphQL

## MongoDB (Mongoose via `@nestjs/mongoose`)

- Entity = schema: `@Schema({ timestamps: true })` + `@Prop()` na classe de domínio,
  `SchemaFactory.createForClass(X)` logo abaixo. `timestamps: true` cuida de
  `createdAt`/`updatedAt` — não declarar manualmente.
- Conexão é única e global (`MongooseModule.forRoot` em `src/app.module.ts`); cada
  módulo só registra seus schemas via `MongooseModule.forFeature([{ name: X.name,
  schema: XSchema }])` no próprio `*.module.ts`.
- `_id` e arrays de relacionamento (`productIds` etc.) são `string`/`string[]` no
  domínio (entity, DTOs GraphQL) e só viram `ObjectId`/`ObjectId[]` dentro do
  datasource, na hora de montar a query — usar sempre os helpers de
  `@shared/utils/to-object-id.ts`: `toObjectId`, `idArrayToObjectId`,
  `objectIdToString`, `objectIdArrayToStrings`. Nunca converter manualmente inline.
- Todo método de datasource retorna objeto plano: `.toObject()` (padrão majoritário) ou
  `.lean()` (datasources mais novos, ex. `print-jobs`) — nunca o `Document` Mongoose cru.
- Paginação é sempre offset/limit: `{ skip: offset, limit }` passado ao `.find()`, tipado
  via `IPaginationOptions` (`@shared/interfaces/pagination-options.ts`) e retornado como
  `ListOutput<T>` (`@shared/interfaces/list-output.ts`) — nunca inventar um shape de
  página novo por módulo.
- Índices: quando o módulo tiver queries frequentes por combinação de campos, ou um
  campo que precisa ser único, declarar logo após `SchemaFactory.createForClass`:
  ```ts
  XSchema.index({ organizationId: 1, locationId: 1 }, { unique: true });
  ```
  (ver `src/modules/print-jobs/entities/print-job.ts` e
  `src/modules/location-shifts/entities/location-shift.ts` como referência real.)
- Duplicidade/erro de conexão: o padrão preferido é **prevenir**, não capturar — buscar
  antes de criar (`findByX` → se existir, lançar exception nomeada; senão `createOne`).
  Só tratar `error.code === 11000` diretamente quando o objetivo for idempotência
  (ver `src/modules/print-jobs/datasources/print-job.datasource.ts`), não como
  tratamento de erro genérico.
- Migrations: não há framework de migration no projeto. Se necessário, seguir o padrão
  ad-hoc de `scripts/migrate-table-orders-to-tabs.ts` (script `ts-node` isolado, com
  `--dry-run`), fora da árvore de `src/modules`.

## GraphQL (code-first, `@nestjs/graphql` + Apollo)

- Sempre code-first: decorators (`@ObjectType`, `@InputType`, `@Field`, `@Resolver`,
  `@Query`, `@Mutation`) nas classes TypeScript. `src/config/schema.gql` é **gerado
  automaticamente** — nunca editar à mão, nunca escrever SDL manual.
- Resolver magro: `@Resolver()` com `@UseGuards(AuthGuard)` na classe inteira; cada
  método extrai `@CurrentUser() user: CurrentUserData` + `@Args('input') input: XInput`
  e delega 100% a `this.xUseCase.execute({ ...input, ...user })`. Zero lógica de
  negócio e zero acesso a datasource/Mongoose no resolver.
- Autenticação/autorização via Guards do Nest, não diretivas GraphQL: `AuthGuard`
  (`@modules/auth/auth.guard.ts`) decodifica o JWT e popula `request.user`;
  `@CurrentUser()` (`@shared/decorators/current-user.ts`) lê `request.user` via
  `GqlExecutionContext`; `RolesGuard` + `@Roles(...)` para autorização por papel.
- Erros: usecases lançam exceptions nomeadas que estendem `BadRequestException`/
  `ForbiddenException`/`UnauthorizedException` do Nest. O driver Apollo/Nest converte
  isso automaticamente em erro GraphQL padrão (`extensions.code`). Nunca lançar
  `GraphQLError` manualmente, nunca modelar união de erro (`XResult | XError`) — não é o
  padrão deste projeto.
- DTOs GraphQL ficam em `usecases/dto/` (ver `architecture-standard.md` para a
  convenção de nome de pasta): inputs com `@InputType()` + decorators `class-validator`
  (`@IsString`, `@IsOptional`, etc.) no mesmo campo que `@Field()`; outputs com
  `@ObjectType()` implementando a interface da entity correspondente.
- Sem `graphql-codegen` — como é code-first, TypeScript já é a fonte da verdade; não
  adicionar geração de tipos a partir do SDL.
