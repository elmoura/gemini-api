import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  LocationPrintConfig,
  LocationPrintConfigDocument,
} from '../entities/location-print-config';
import { PrintStation } from '../enums/print-station';

@Injectable()
export class LocationPrintConfigDataSource {
  constructor(
    @InjectModel(LocationPrintConfig.name)
    private configModel: Model<LocationPrintConfigDocument>,
  ) {}

  async findOrCreateByLocation(
    organizationId: string,
    locationId: string,
  ): Promise<LocationPrintConfig> {
    const existing = await this.configModel
      .findOne({ organizationId, locationId })
      .lean()
      .exec();

    if (existing) return existing;

    const created = await this.configModel.create({
      organizationId,
      locationId,
      defaultStation: PrintStation.KITCHEN,
      defaultPaperWidthMm: 80,
    });

    return created.toObject();
  }
}
