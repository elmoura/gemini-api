import { BadRequestException } from '@nestjs/common';

export class OrganizationNotFoundException extends BadRequestException {
  constructor() {
    super('Opa, essa organização não existe!');
  }
}
