import { registerEnumType } from '@nestjs/graphql';

export enum OrganizationRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  CASHIER = 'CASHIER',
  WAITER = 'WAITER',
}

registerEnumType(OrganizationRole, { name: 'OrganizationRole' });
