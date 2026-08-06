import { BadRequestException } from '@nestjs/common';

export class TableAlreadyOpenException extends BadRequestException {
  constructor() {
    super('Já existe um atendimento em andamento nesta mesa');
  }
}
