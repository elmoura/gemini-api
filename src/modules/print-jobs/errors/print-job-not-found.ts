import { NotFoundException } from '@nestjs/common';

export class PrintJobNotFoundException extends NotFoundException {
  constructor() {
    super('Job de impressão não encontrado');
  }
}
