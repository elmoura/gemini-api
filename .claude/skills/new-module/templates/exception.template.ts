// Template: errors/__entity-name__-not-found.exception.ts
// Uma classe por caso de erro de negócio. Mensagem em português, para o usuário final.
// Nome do arquivo/classe deve descrever o caso específico (ex.: XNotFoundException,
// XAlreadyExistsException) — nunca lançar BadRequestException genérica solta.
import { BadRequestException } from '@nestjs/common';

export class __EntityName__NotFoundException extends BadRequestException {
  constructor(id: string) {
    super(`Ops! O(a) __entityNamePt__ "${id}" não existe.`);
  }
}
