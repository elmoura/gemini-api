import 'dotenv/config';
import mongoose from 'mongoose';

const MONGO_URL = process.env.MONGO_URL || '';

const dryRun = process.argv.includes('--dry-run');

function mapStatus(tableOrderStatus: string): string {
  if (tableOrderStatus === 'finalizado') {
    return 'finalizada';
  }

  return 'em atendimento';
}

async function migrate() {
  if (!MONGO_URL) {
    throw new Error('MONGO_URL is required');
  }

  await mongoose.connect(MONGO_URL);

  const db = mongoose.connection.db;
  const tableOrders = db.collection('tableorders');
  const orderTabs = db.collection('ordertabs');

  const withItems = await tableOrders
    .find({
      items: { $exists: true, $type: 'array', $not: { $size: 0 } },
    })
    .toArray();

  for (const tableOrder of withItems) {
    const tableOrderId = tableOrder._id.toString();

    if (tableOrder.tabIds?.length > 0) {
      console.log(`skip (already migrated): ${tableOrderId}`);
      continue;
    }

    const orderTabDoc = {
      tableOrderId,
      organizationId: tableOrder.organizationId,
      locationId: tableOrder.locationId,
      sequence: 1,
      status: mapStatus(tableOrder.status),
      items: tableOrder.items,
      pricing: tableOrder.pricing,
      payment: tableOrder.payment,
      createdAt: tableOrder.createdAt ?? new Date(),
      updatedAt: tableOrder.updatedAt ?? new Date(),
    };

    console.log(
      JSON.stringify({
        tableOrderId,
        itemsCount: tableOrder.items?.length ?? 0,
        dryRun,
      }),
    );

    if (dryRun) continue;

    const insertResult = await orderTabs.insertOne(orderTabDoc);
    const orderTabId = insertResult.insertedId.toString();

    await tableOrders.updateOne(
      { _id: tableOrder._id },
      {
        $set: { tabIds: [orderTabId] },
        $unset: { items: '' },
      },
    );

    console.log(
      JSON.stringify({
        tableOrderId,
        orderTabId,
        itemsCount: tableOrder.items?.length ?? 0,
      }),
    );
  }

  const withoutTabIds = await tableOrders
    .find({
      $or: [{ tabIds: { $exists: false } }, { tabIds: null }],
    })
    .toArray();

  for (const tableOrder of withoutTabIds) {
    const tableOrderId = tableOrder._id.toString();

    if (tableOrder.items?.length > 0) {
      continue;
    }

    console.log(
      JSON.stringify({
        tableOrderId,
        action: 'set-empty-tabIds',
        dryRun,
      }),
    );

    if (dryRun) continue;

    await tableOrders.updateOne(
      { _id: tableOrder._id },
      {
        $set: { tabIds: [] },
        $unset: { items: '' },
      },
    );
  }

  await mongoose.disconnect();
}

migrate().catch((error) => {
  console.error(error);
  process.exit(1);
});
