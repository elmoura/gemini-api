import { ConflictException } from '@nestjs/common';

export class InvitationAlreadyPendingError extends ConflictException {
  constructor() {
    super('Já existe um convite pendente para esse e-mail nesta organização.');
  }
}
