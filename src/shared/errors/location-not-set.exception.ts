import { ForbiddenError } from 'apollo-server-express';

export class LocationNotSetException extends ForbiddenError {
  constructor() {
    super(
      'Você não está autorizado a realizar essa ação pois não selecionou uma unidade de atuação.',
    );
  }
}
