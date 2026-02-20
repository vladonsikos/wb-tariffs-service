import { fetchBoxTariffs } from '../services/wbApi';
import { upsertTariffs, getTariffsByDate } from '../services/tariffsDb';
import { updateAllSpreadsheets } from '../services/googleSheets';

export async function runTariffJob(): Promise<void> {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  console.log(`[Job] Запуск задачи. Дата: ${today}`);

  // 1. Получаем тарифы из WB API
  const tariffs = await fetchBoxTariffs(today);
  console.log(`[Job] Получено тарифов от WB: ${tariffs.length}`);

  // 2. Сохраняем / обновляем в БД
  await upsertTariffs(tariffs, today);
  console.log(`[Job] Данные сохранены в БД`);

  // 3. Читаем из БД (уже отсортированные по коэффициенту)
  const dbTariffs = await getTariffsByDate(today);

  // 4. Обновляем Google Sheets
  await updateAllSpreadsheets(dbTariffs);
  console.log(`[Job] Google Sheets обновлены`);
}
