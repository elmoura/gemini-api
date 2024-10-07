import { ObjectId } from 'mongodb';

export const toObjectId = (id: string): ObjectId => new ObjectId(id);

export const idArrayToObjectId = (ids: string[]): ObjectId[] =>
  ids.map((id) => toObjectId(id));

export const objectIdToString = (objectId: ObjectId): string =>
  objectId.toString();

export const objectIdArrayToStrings = (objectIds: ObjectId[]): string[] =>
  objectIds.map((id) => objectIdToString(id));
