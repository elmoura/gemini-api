export interface ListOutput<ItemType = any> {
  count: number;
  limit: number;
  offset: number;
  data: ItemType[];
}
