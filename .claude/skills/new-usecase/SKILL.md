---
name: new-usecase
description: "Adiciona 1 usecase novo (com spec, dto e método de resolver) a um módulo de domínio já existente em gemini-api, reaproveitando os templates de new-module. Use when: adicionar usecase, nova mutation, nova query, novo caso de uso em módulo existente, /new-usecase."
user-invocable: true
argument-hint: "<module-folder> <action-name>"
---

# new-usecase

Harness leve para o fluxo do dia a dia: adicionar mais uma ação de negócio
(`find`/`list`/`update`/`search`/etc.) a um módulo que já tem entity/datasource
prontos. Segue as mesmas rules do módulo: `../../rules/architecture-standard.md` e
`../../rules/testing-standard.md`.

## Input

- `$ARGUMENTS[0]` — pasta do módulo existente (ex.: `categories`)
- `$ARGUMENTS[1]` — nome da ação, kebab-case (ex.: `find-category`, `list-suppliers`)

## Protocolo

1. Confirmar que `src/modules/<module-folder>/` já tem `entities/` e `datasources/`
   prontos. **Se não tiver**, parar e sugerir a skill `new-module` em vez de tentar
   criar tudo aqui.
2. Ler os templates em `../new-module/templates/` como referência de esqueleto:
   `usecase.template.ts`, `usecase.spec.template.ts`, `dto-input.template.ts`,
   `dto-object.template.ts` (não copiar o "create" literal — adaptar a assinatura e o
   corpo para a ação pedida: `find`/`list` fazem leitura via datasource e lançam
   not-found; `update` recebe `Partial<Entity>` e chama `updateOne`; `list` retorna
   `ListOutput<T>` com `IPaginationOptions`, ver `mongodb-graphql-patterns.md`).
3. Se o datasource existente não tiver o método necessário (ex.: `findById` para uma
   ação `find`), adicionar o método ao datasource seguindo o padrão de
   `architecture-standard.md`/`mongodb-graphql-patterns.md` — não duplicar lógica de
   query fora do datasource.
4. Gerar:
   - `usecases/<action-name>.usecase.ts`
   - `usecases/<action-name>.usecase.spec.ts` (casos mínimos de
     `testing-standard.md`: sucesso, not-found quando aplicável, violação de regra,
     efeito colateral não deve ocorrer no erro, isolamento multi-tenant quando o
     usecase recebe organizationId/locationId)
   - DTOs novos em `usecases/dto/` se a ação precisar de input/output diferente dos
     já existentes no módulo
5. Adicionar o método correspondente (`@Query()`/`@Mutation()`) ao
   `*.resolver.ts` já existente do módulo, delegando 100% ao novo usecase.
6. Registrar o novo usecase (e DTOs novos, se houver) nos `providers` do
   `*.module.ts` do módulo.
7. Rodar o teste novo (`npm test -- <module-folder>`) antes de reportar concluído.

## Forbidden

- Criar um módulo inteiro do zero aqui (isso é escopo de `new-module`)
- Pular o spec do usecase novo
- Duplicar template em vez de referenciar `../new-module/templates/`
- Lançar `BadRequestException` genérica em vez de exception nomeada em `errors/`
