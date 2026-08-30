import { NotFoundException } from '@nestjs/common';

export class InvitationNotFoundError extends NotFoundException {
  constructor() {
    super('Convite não encontrado.');
  }
}
