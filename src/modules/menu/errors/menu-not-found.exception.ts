import { BadRequestException } from '@nestjs/common';

export class MenuNotFoundException extends BadRequestException {
  constructor(menuId: string) {
    super(`O menu "${menuId}" não foi encontrado :(`);
  }
}
