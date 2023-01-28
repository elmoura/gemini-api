import { BadRequestException } from '@nestjs/common';

export class UserAlreadyExistsError extends BadRequestException {
  constructor() {
    super('Opa! Esse usuário já existe.');
  }
}
