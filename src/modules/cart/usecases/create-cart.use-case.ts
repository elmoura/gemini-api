import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';

@Injectable()
export class CreateCartUseCase implements IBaseUseCase<void, void> {
  async execute(input: void): Promise<void> {}
}
