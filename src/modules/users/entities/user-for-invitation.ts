import { IBaseCollection } from '@shared/interfaces/base-collection';
import { AccountStatuses } from '../enums/account-confirmation-statuses';

export interface IUserForInvitation extends IBaseCollection {
  organizationId: string;

  email: string;

  accountStatus: AccountStatuses;
}
