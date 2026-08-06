import { LocationShiftStatuses } from '../enums/location-shift-statuses';
import { LocationShift } from '../entities/location-shift';
import {
  buildOpenLocationShiftFilter,
  isLocationShiftOpen,
} from './location-shift-open.utils';

const buildShift = (overrides: Partial<LocationShift>): LocationShift =>
  ({
    _id: 'shift-id',
    organizationId: 'org-id',
    locationId: 'location-id',
    status: LocationShiftStatuses.OPEN,
    startedAt: new Date('2026-07-13T10:00:00.000Z'),
    finishedAt: null,
    currentTableOrderQuantity: 0,
    currentOrderTabsQuantity: 0,
    createdAt: new Date('2026-07-13T10:00:00.000Z'),
    updatedAt: new Date('2026-07-13T10:00:00.000Z'),
    ...overrides,
  }) as LocationShift;

describe('isLocationShiftOpen', () => {
  it('retorna true quando status é OPEN e finishedAt é null', () => {
    expect(
      isLocationShiftOpen(
        buildShift({
          status: LocationShiftStatuses.OPEN,
          finishedAt: null,
        }),
      ),
    ).toBe(true);
  });

  it('retorna false quando status é CLOSED e finishedAt está preenchido', () => {
    expect(
      isLocationShiftOpen(
        buildShift({
          status: LocationShiftStatuses.CLOSED,
          finishedAt: new Date('2026-07-13T18:00:00.000Z'),
        }),
      ),
    ).toBe(false);
  });

  it('retorna true defensivamente quando startedAt existe e finishedAt é null', () => {
    expect(
      isLocationShiftOpen(
        buildShift({
          status: LocationShiftStatuses.CLOSED,
          startedAt: new Date('2026-07-13T10:00:00.000Z'),
          finishedAt: null,
        }),
      ),
    ).toBe(true);
  });
});

describe('buildOpenLocationShiftFilter', () => {
  it('monta o filtro Mongo para turno aberto por org e unidade', () => {
    expect(buildOpenLocationShiftFilter('org-id', 'location-id')).toEqual({
      organizationId: 'org-id',
      locationId: 'location-id',
      $or: [
        { status: LocationShiftStatuses.OPEN },
        { startedAt: { $ne: null }, finishedAt: null },
      ],
    });
  });
});
