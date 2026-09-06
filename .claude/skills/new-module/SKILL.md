---
name: new-module
description: "Scaffold de um novo módulo de domínio completo em gemini-api (entity, datasource, errors, 1 usecase, spec, dto, resolver, module) seguindo o padrão de arquitetura do projeto. Use when: novo módulo, criar módulo de domínio, scaffold module, /new-module."
user-invocable: true
argument-hint: "<module-folder-plural> <EntityName>"
---

# new-module

Harness de scaffold para um módulo de domínio novo em `gemini-api`, seguindo
`../../rules/architecture-standard.md`, `../../rules/testing-standard.md` e
`../../rules/mongodb-graphql-patterns.md` como fonte da verdade. Gera o esqueleto
mínimo funcional (1 usecase, "create") — usecases adicionais (find/list/update/search)
entram depois via skill `new-usecase`.

## Input

- `$ARGUMENTS[0]` — nome da pasta do módulo, kebab-case plural (ex.: `suppliers`)
- `$ARGUMENTS[1]` — nome PascalCase singular da entidade principal (ex.: `Supplier`)

Se ambíguo ou faltando, perguntar ao usuário antes de gerar qualquer arquivo.

## Protocolo

1. Confirmar `module-folder` (kebab-case plural) e `EntityName` (PascalCase singular).
   Derivar `entityName` (camelCase) e `entity-name`/`entity-name-pt` (kebab-case /
   nome em português para mensagens de erro) a partir daí.
2. Reler `../../rules/architecture-standard.md` e
   `../../rules/mongodb-graphql-patterns.md` antes de gerar código — são a fonte da
   verdade, os templates abaixo são só o ponto de partida sintático.
3. Criar os arquivos em `src/modules/<module-folder>/`, nesta ordem, adaptando cada
   template (`templates/*.template.ts`) ao caso real — substituir os placeholders
   (`__EntityName__`, `__entityName__`, `__entity-name__`, `__entity-name-pt__`,
   `__module-folder__`, `__module-folder-singular__`) e preencher os campos/TODOs
   específicos do domínio:
   1. `entities/<entityName>.ts` ← `templates/entity.template.ts`
   2. `datasources/<entityName>.datasource.ts` ← `templates/datasource.template.ts`
   3. `errors/<entity-name>-not-found.exception.ts` ← `templates/exception.template.ts`
   4. `usecases/create-<entity-name>.usecase.ts` ← `templates/usecase.template.ts`
   5. `usecases/create-<entity-name>.usecase.spec.ts` ← `templates/usecase.spec.template.ts`
   6. `usecases/dto/create-<entity-name>.input.ts` ← `templates/dto-input.template.ts`
   7. `usecases/dto/<entity-name>.object.ts` ← `templates/dto-object.template.ts`
   8. `<module-folder-singular>.resolver.ts` ← `templates/resolver.template.ts`
   9. `<module-folder>.module.ts` ← `templates/module.template.ts`
4. Registrar o novo módulo em `src/app.module.ts`: import + adicionar à lista
   `imports` do `AppModule`.
5. Rodar `npm test -- <module-folder>` (ou `yarn test`) para confirmar que o spec
   novo passa.
6. Conferir o checklist "Definition of Done" de `architecture-standard.md` antes de
   reportar concluído.

## Forbidden

- Usar `dtos/`/`types/` como nome de subpasta de DTO (padrão é `dto/`)
- Usar sufixo `.use-case.ts` (padrão é `.usecase.ts`)
- Pular o `.usecase.spec.ts` do usecase gerado
- Lançar `BadRequestException` genérica em vez de exception nomeada em `errors/`
- Fazer o resolver acessar datasource/Mongoose diretamente
- Editar `src/config/schema.gql` manualmente (é gerado)
