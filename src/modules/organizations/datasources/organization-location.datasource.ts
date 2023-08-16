import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IBaseCollection } from '@shared/interfaces/base-collection';
import { OrganizationLocation } from '../entities/organization-location';

interface IOrganizationLocationDataSource {
  findById(locationId: string): Promise<OrganizationLocation | null>;
  findLocationsByOrgId(organizationId: string): Promise<OrganizationLocation[]>;
  findOrgLocationByIds(
    organizationId: string,
    locationId: string,
  ): Promise<OrganizationLocation>;
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

  async findOrgLocationByIds(
    organizationId: string,
    locationId: string,
  ): Promise<OrganizationLocation> {
    return this.organizationLocationModel.findOne({
      _id: locationId,
      organizationId,
    });
  }

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
