import { BadRequestException } from '@nestjs/common';

export class LastAdminError extends BadRequestException {
  constructor() {
    super('A organização precisa ter pelo menos um administrador.');
  }
}
