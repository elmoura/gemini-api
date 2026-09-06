# Padrão de Arquitetura — Módulos de Domínio

## Stack

NestJS (DI via `@Module`) + GraphQL code-first (`@nestjs/graphql`/Apollo, schema
autogerado em `src/config/schema.gql` — **nunca editar esse arquivo à mão**) +
Mongoose (`@nestjs/mongoose`). Imports absolutos via `@modules/*`, `@shared/*`,
`@config/*` (ver `tsconfig.json`/`moduleNameMapper` do Jest).

## Camadas de um módulo (bounded context)

Cada módulo vive em `src/modules/<module-name>/` (kebab-case, plural quando representa
uma coleção: `products`, `categories`, `location-shifts`). Referências reais de módulos
bem formados: `src/modules/products/`, `src/modules/categories/`.

| Camada | Path | Responsabilidade |
|---|---|---|
| Entity | `entities/<name>.ts` | Classe `@Schema()`/`@Prop()` (Mongoose) — é ao mesmo tempo o schema de persistência e o modelo de domínio. Exporta `type XDocument = X & Document` e `XSchema = SchemaFactory.createForClass(X)`. |
| Datasource | `datasources/<name>.datasource.ts` | Única camada que toca `Model<XDocument>` (`@InjectModel`). Define e implementa uma interface local `IXDataSource` (não compartilhada entre módulos). Retorna sempre `.toObject()`/`.lean()`, nunca o Document Mongoose cru. |
| Errors | `errors/<caso>.exception.ts` | Uma classe por caso de erro de negócio, estendendo `BadRequestException`/`ForbiddenException`/`UnauthorizedException` do Nest. Mensagem em português, voltada ao usuário final. |
| Usecases | `usecases/<ação>.usecase.ts` | Uma classe `@Injectable()` por ação, implementa `IBaseUseCase<Input, Output>` (`@shared/interfaces/base-use-case.ts`). Único método `execute(input)`. Toda regra de negócio mora aqui — nunca no resolver. |
| Usecase spec | `usecases/<ação>.usecase.spec.ts` | Obrigatório para todo usecase novo — ver `testing-standard.md`. |
| DTO | `usecases/dto/<ação>.input.ts`, `usecases/dto/<name>.object.ts` | `@InputType()`/`@ObjectType()` + decorators `class-validator` lado a lado com `@Field()`. |
| Validations (quando houver regra reutilizável) | `validations/<regra>.validation.ts` | Classe `@Injectable()` com `execute(params)`, injetada em usecases que precisam da mesma checagem. Lança sempre uma exception nomeada de `errors/`, nunca `BadRequestException` genérica solta. |
| Resolver | `<module-name>.resolver.ts` | `@Resolver()` com `@UseGuards(AuthGuard)` na classe. Cada método é `@Query()`/`@Mutation()`, extrai `@CurrentUser()` + `@Args('input')` e delega 100% a `usecase.execute(...)`. Nunca acessa datasource/Mongoose diretamente. |
| Module | `<module-name>.module.ts` | `@Module({ imports: [...outros módulos Nest, MongooseModule.forFeature([...])], providers: [resolver, datasources, usecases, validations] })`. Composição de dependências é 100% via Nest — não existe `main/factories`. |

## Convenção de nomenclatura (normalizada para módulos novos)

O código existente tem variações históricas — **módulos novos seguem só a coluna
"Padrão"**, não replicam a variação antiga:

| Item | Padrão | Variações antigas a NÃO repetir |
|---|---|---|
| Subpasta de DTO | `usecases/dto/` | `dtos/` (customers), `types/` (categories) |
| Sufixo de usecase | `<ação>.usecase.ts` | `<ação>.use-case.ts` (customers) |
| Erro de validação de negócio | exception nomeada em `errors/` | `BadRequestException` genérica direto na validation |
| Interface de datasource | `IXDataSource` local ao arquivo do datasource | interface compartilhada entre módulos (não existe hoje, não criar) |

## SOLID / Clean Architecture / DRY — aplicado a este projeto

Estas regras são a leitura pragmática de SOLID/Clean Architecture já usada no código
real, não um ideal acadêmico a impor por cima do padrão NestJS:

- **SRP** — 1 usecase = 1 ação de negócio (`create-x`, `find-x`, `list-x`). Se um
  usecase cresce para cobrir 2 ações, é sinal de que deveria virar 2 usecases.
- **OCP** — nova regra de negócio entra como nova classe (`validations/*.ts` ou novo
  usecase), sem reabrir/reescrever usecases já existentes e testados.
- **LSP** — mocks de datasource nos testes devem respeitar exatamente a assinatura da
  interface `IXDataSource` real (nada de mock com shape divergente "só pra passar").
- **ISP** — a interface do datasource expõe só os métodos que os usecases do módulo
  realmente chamam; não crie métodos "genéricos" especulativos.
- **DIP** — usecases dependem só de interfaces injetadas via construtor (Nest DI).
  Nunca instanciam `Model`/Mongoose diretamente nem importam outro datasource sem
  passar pelo construtor.
- **DRY** — reusar sempre `IBaseUseCase<Input,Output>`, `ListOutput<T>` e
  `IPaginationOptions` (`@shared/interfaces/`) para usecases e listagens paginadas —
  nunca reinventar o shape de paginação por módulo. Reusar helpers de
  `@shared/utils/to-object-id.ts` (`toObjectId`, `idArrayToObjectId`,
  `objectIdToString`, `objectIdArrayToStrings`) em vez de converter `ObjectId`/`string`
  manualmente em cada datasource.

### Decisão consciente do projeto (não "corrigir" em módulos novos)

A `entity` acopla schema Mongoose e modelo de domínio na mesma classe — não há uma
camada de "domain entity" pura desacoplada de persistência. Isso é Nest-idiomático e
consistente em todo o código existente; **mantenha esse acoplamento em módulos novos**,
não introduza uma camada extra de domain model "puro" que quebraria a consistência com
o resto do projeto.

## Definition of Done — módulo/usecase novo

- [ ] Camadas na ordem certa: entity → datasource (+ interface local) → errors →
      usecase → **usecase.spec** → dto → resolver → module
- [ ] Nomenclatura segue a coluna "Padrão" da tabela acima (não a variação antiga)
- [ ] Toda exceção de negócio é uma classe nomeada em `errors/`, nunca
      `BadRequestException` genérica solta
- [ ] Resolver não acessa datasource/Mongoose diretamente — só chama `usecase.execute`
- [ ] Módulo novo registrado em `src/app.module.ts` (`imports`)
- [ ] Casos de teste mínimos de `testing-standard.md` cobertos no `.spec.ts`
- [ ] Se o módulo toca MongoDB/GraphQL diretamente, seguir `mongodb-graphql-patterns.md`
