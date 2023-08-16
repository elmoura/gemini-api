import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IBaseCollection } from '@shared/interfaces/base-collection';
import { OrganizationLocation } from '../entities/organization-location';

interface IOrganizationLocationDataSource {
  findById(locationId: string): Promise<OrganizationLocation | null>;
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

  async findById(locationId: string): Promise<OrganizationLocation | null> {
    return this.organizationLocationModel.findById(locationId);
  }

  async createOne(
    payload: Omit<OrganizationLocation, keyof IBaseCollection>,
  ): Promise<OrganizationLocation> {
    const createdLocation = await this.organizationLocationModel.create(
      payload,
    );

    return createdLocation.toObject();
  }
}
