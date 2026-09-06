# Padrão de Testes — TDD Obrigatório para Usecases

## Regra central

Todo usecase novo **nasce com `<ação>.usecase.spec.ts`** — escrito antes ou junto da
implementação (red → green → refactor), nunca depois "se sobrar tempo". Um usecase sem
spec não está pronto, independente de quão simples pareça.

Framework: **Jest 28 + ts-jest** (config em `package.json`, chave `"jest"`). Specs
co-localizados junto do arquivo testado, sempre `*.spec.ts` (nunca `*.test.ts`).

## Casos de teste mínimos obrigatórios por usecase

Baseado no padrão já consistente nos specs existentes (ex.
`src/modules/table-orders/usecases/create-table-order.usecase.spec.ts`,
`src/modules/users/usecases/create-user-invitation.usecase.spec.ts`,
`src/modules/products/usecases/find-product.usecase.spec.ts`):

1. **Sucesso** — caminho feliz, confere o shape do que foi persistido/retornado.
2. **Not-found** — dependência (entidade buscada) não existe → exception nomeada.
3. **Violação de regra de negócio** — pelo menos 1 caso por regra que o usecase impõe
   (ex.: "já existe", "sem turno aberto", "convite pendente já existe") → exception
   nomeada, nunca genérica.
4. **Efeito colateral não deve ocorrer no caminho de erro** — todo `it` de erro precisa
   confirmar `expect(dataSource.metodo).not.toHaveBeenCalled()` (ou equivalente) para o
   método que só deveria rodar no sucesso.
5. **Isolamento multi-tenant** (quando o usecase recebe `organizationId`/`locationId`) —
   um recurso de outro tenant deve se comportar como not-found, nunca vazar dado.

## Convenção de mock (seguir exatamente, sem lib de mocking)

- Mock manual por dependência: `{ metodo: jest.fn() }`, sem ts-mockito/sinon/
  jest-mock-extended.
- Instanciação direta do usecase no teste: `new XUseCase(depMock as never, ...)` — não
  usar `Test.createTestingModule` do `@nestjs/testing` para testar usecase isolado (isso
  é reservado ao único e2e existente do app).
- `beforeEach` com `jest.clearAllMocks()` + reconfiguração dos retornos de "happy path"
  via `mockResolvedValue`/`mockImplementation`; cada `it` sobrescreve só o que precisa.
- `describe(NomeDoUseCase)` > `it('frase em português descrevendo o comportamento')`.
- Asserts: `expect(x).rejects.toBeInstanceOf(ExceptionEspecifica)` para erros,
  `expect(dataSource.metodo).toHaveBeenCalledWith(expect.objectContaining({...}))` para
  side-effects esperados.
- Mockar também usecases colaboradores (não só datasources) da mesma forma:
  `{ execute: jest.fn() }`.

## Gaps conhecidos (documentados, não impostos ainda)

Estes pontos existem hoje como lacuna real do projeto. Ficam registrados aqui como
recomendação futura — **não bloqueiam trabalho atual** e não foram aplicados fora de
`.claude/` nesta rodada:

- Sem `coverageThreshold` configurado no Jest (`package.json`) — cobertura mínima não é
  imposta por tooling.
- Sem teste de `*.resolver.ts` (nenhum dos 11 resolvers tem spec hoje).
- Sem teste de integração real contra MongoDB (ex. via `mongodb-memory-server`) — specs
  de datasource mockam o `Model` do Mongoose, não é integração real.
- Sem CI (`.github/workflows`) rodando `test`/`test:cov` em PRs de `gemini-api`.

Se algum desses pontos virar prioridade, tratar como tarefa própria (mexe em
`package.json`/CI, fora do escopo de `.claude/`).
