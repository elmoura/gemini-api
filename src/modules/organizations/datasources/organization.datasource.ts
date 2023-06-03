import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IBaseCollection } from '@shared/interfaces/base-collection';
import { Organization, OrganizationDocument } from '../entities/organization';

interface IOrganizationDataSource {
  createOne(
    input: Omit<Organization, keyof IBaseCollection>,
  ): Promise<Organization>;

  updateOne(
    organizationId: string,
    data: Partial<Organization>,
  ): Promise<Organization>;
}

@Injectable()
export class OrganizationDataSource implements IOrganizationDataSource {
  constructor(
    @InjectModel(Organization.name)
    private readonly orgModel: Model<OrganizationDocument>,
  ) {}

  async createOne(
    input: Omit<Organization, keyof IBaseCollection>,
  ): Promise<Organization> {
    const createdOrg = await this.orgModel.create(input);
    return createdOrg.toObject();
  }

  async updateOne(
    organizationId: string,
    data: Partial<Organization>,
  ): Promise<Organization> {
    return this.orgModel.findByIdAndUpdate(organizationId, data);
  }
}
