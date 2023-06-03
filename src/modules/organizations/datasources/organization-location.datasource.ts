import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IBaseCollection } from '@shared/interfaces/base-collection';
import { OrganizationLocation } from '../entities/organization-location';

interface IOrganizationLocationDataSource {
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
}
