import { Resolver } from '@nestjs/graphql';

@Resolver()
export class TableResolver {
  constructor() {}

  // precisa receber o locationId atraves do token
  // criar fluxo de settar o locationId atraves do token
  async createTable() {}
}
