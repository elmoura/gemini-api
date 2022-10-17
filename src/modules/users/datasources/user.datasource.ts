import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../entities/user';
import { AccountStatuses } from '../enums/account-confirmation-statuses';
import { IUserForInvitation } from '../entities/user-for-invitation';

export interface IUserInvitationData {
  email: string;
  organizationId: string;
}

export interface IUserDataSource {
  createInvitationInstance(
    data: IUserInvitationData,
  ): Promise<IUserForInvitation>;
}

@Injectable()
export class UserDataSource implements IUserDataSource {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async createInvitationInstance({
    email,
    organizationId,
  }: IUserInvitationData): Promise<IUserForInvitation> {
    return this.userModel.create({
      email,
      organizationId,
      accountStatus: AccountStatuses.PENDING,
    });
  }
}
