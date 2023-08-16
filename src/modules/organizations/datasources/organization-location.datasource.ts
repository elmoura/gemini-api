import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IBaseCollection } from '@shared/interfaces/base-collection';
import { OrganizationLocation } from '../entities/organization-location';

interface IOrganizationLocationDataSource {
  findLocationsByOrgId(organizationId: string): Promise<OrganizationLocation[]>;
  createOne(
    payload: Omit<OrganizationLocation, keyof IBaseCollection>,
  ): Promise<OrganizationLocation>;
}

@Injectable()
export class OrganizationLocationDataSource
  implements IOrganizationLocationDataSource
{
  constructor(
    @InjectModel(OrganizationLocation.name)
    private organizationLocationModel: Model<OrganizationLocation>,
  ) {}

  async createOne(
    payload: Omit<OrganizationLocation, keyof IBaseCollection>,
  ): Promise<OrganizationLocation> {
    const createdLocation = await this.organizationLocationModel.create(
      payload,
    );

    return createdLocation.toObject();
  }

  async findLocationsByOrgId(
    organizationId: string,
  ): Promise<OrganizationLocation[]> {
    return this.organizationLocationModel.find({ organizationId });
  }
}
