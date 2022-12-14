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
  findById(userId: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  createInvitationInstance(
    data: IUserInvitationData,
  ): Promise<IUserForInvitation>;
  updateOne(userId: string, payload: Partial<User>): Promise<boolean>;
}

@Injectable()
export class UserDataSource implements IUserDataSource {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async findById(userId: string): Promise<User | null> {
    return this.userModel.findById(userId);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

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

  async updateOne(userId: string, payload: Partial<User>): Promise<boolean> {
    const result = await this.userModel.updateOne({ _id: userId }, payload);
    return result.modifiedCount > 0;
  }
}
