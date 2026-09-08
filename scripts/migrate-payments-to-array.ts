import 'dotenv/config';
import mongoose from 'mongoose';

const MONGO_URL = process.env.MONGO_URL || '';

const dryRun = process.argv.includes('--dry-run');

const DEFAULT_PAYMENT_STATUS = 'PENDING';

type MigrationCounters = {
  migrated: number;
  skipped: number;
  conflict: number;
};

/**
 * Migra um documento de `payment` (objeto único, formato pré-migração) para
 * `payments` (array de 1 elemento), preservando os dados do objeto original
 * sem alteração. Idempotente: documentos já em array são pulados.
 */
async function migrateCollection(
  collectionName: 'tableorders' | 'ordertabs',
): Promise<MigrationCounters> {
  const db = mongoose.connection.db;
  const collection = db.collection(collectionName);
  const counters: MigrationCounters = { migrated: 0, skipped: 0, conflict: 0 };

  const docs = await collection.find({}).toArray();

  for (const doc of docs) {
    const docId = doc._id.toString();

    if (Array.isArray(doc.payments)) {
      if (doc.payment) {
        // Conflito: código antigo gravou `payment` solto por cima de um
        // documento já migrado. Preferir `payments` (mais recente) e só
        // limpar o campo órfão.
        counters.conflict += 1;
        console.log(
          JSON.stringify({
            collection: collectionName,
            docId,
            action: 'conflict-cleanup',
            note: 'payment e payments coexistiam; mantendo payments, removendo payment órfão',
            dryRun,
          }),
        );

        if (!dryRun) {
          await collection.updateOne(
            { _id: doc._id },
            { $unset: { payment: '' } },
          );
        }
        continue;
      }

      counters.skipped += 1;
      console.log(
        JSON.stringify({
          collection: collectionName,
          docId,
          action: 'skip (already migrated)',
        }),
      );
      continue;
    }

    if (!doc.payment || typeof doc.payment !== 'object') {
      counters.skipped += 1;
      console.log(
        JSON.stringify({
          collection: collectionName,
          docId,
          action: 'skip (no payment field)',
        }),
      );
      continue;
    }

    const update: Record<string, unknown> = {
      $set: { payments: [doc.payment] },
      $unset: { payment: '' },
    };

    // `paymentStatus` passa a viver no nível do documento em `ordertabs`
    // (agregado da comanda), não dentro do pagamento individual — promover o
    // valor legado, com default explícito quando ausente.
    if (collectionName === 'ordertabs' && doc.paymentStatus === undefined) {
      const derivedStatus = doc.payment.paymentStatus ?? DEFAULT_PAYMENT_STATUS;
      (update.$set as Record<string, unknown>).paymentStatus = derivedStatus;
    }

    counters.migrated += 1;
    console.log(
      JSON.stringify({
        collection: collectionName,
        docId,
        action: 'migrate',
        dryRun,
      }),
    );

    if (dryRun) continue;

    await collection.updateOne({ _id: doc._id }, update);
  }

  return counters;
}

async function migrate() {
  if (!MONGO_URL) {
    throw new Error('MONGO_URL is required');
  }

  await mongoose.connect(MONGO_URL);

  const tableOrdersCounters = await migrateCollection('tableorders');
  const orderTabsCounters = await migrateCollection('ordertabs');

  console.log(
    JSON.stringify({
      summary: {
        tableorders: tableOrdersCounters,
        ordertabs: orderTabsCounters,
      },
      dryRun,
    }),
  );

  await mongoose.disconnect();
}

migrate().catch((error) => {
  console.error(error);
  process.exit(1);
});
