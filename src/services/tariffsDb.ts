import db from '../config/db';
import { WBBoxTariff, TariffRecord } from '../types';

const TABLE = 'wb_box_tariffs';

export async function upsertTariffs(tariffs: WBBoxTariff[], date: string): Promise<void> {
  const records: Omit<TariffRecord, 'id' | 'created_at' | 'updated_at'>[] = tariffs.map((t) => ({
    warehouse_name: t.warehouseName,
    box_delivery_and_storage_expr: t.boxDeliveryAndStorageExpr,
    box_delivery_base: parseFloat(t.boxDeliveryBase) || 0,
    box_delivery_liter: parseFloat(t.boxDeliveryLiter) || 0,
    box_storage_base: parseFloat(t.boxStorageBase) || 0,
    box_storage_liter: parseFloat(t.boxStorageLiter) || 0,
    date,
  }));

  // Upsert: вставляем или обновляем если уже есть запись на этот день
  for (const record of records) {
    await db(TABLE)
      .insert({ ...record, created_at: db.fn.now(), updated_at: db.fn.now() })
      .onConflict(['warehouse_name', 'date'])
      .merge({
        ...record,
        updated_at: db.fn.now(),
      });
  }
}

export async function getTariffsByDate(date: string): Promise<TariffRecord[]> {
  return db(TABLE)
    .where({ date })
    .orderBy('box_delivery_base', 'asc');
}
