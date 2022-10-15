export interface IBaseUseCase<Input, Output> {
  execute(input: Input): Promise<Output>;
}
