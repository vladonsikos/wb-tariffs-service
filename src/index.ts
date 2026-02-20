import 'dotenv/config';
import cron from 'node-cron';
import db from './config/db';
import { runTariffJob } from './jobs/tariffJob';

const CRON_SCHEDULE = process.env.CRON_SCHEDULE || '0 * * * *';

async function runMigrations() {
  console.log('[DB] Применяем миграции...');
  await db.migrate.latest({
    directory: __dirname + '/db/migrations',
    extension: 'js', // после сборки это будут .js файлы
  });
  console.log('[DB] Миграции применены');
}

async function main() {
  await runMigrations();

  // Запускаем сразу при старте
  console.log('[App] Первый запуск задачи...');
  await runTariffJob().catch((err) => console.error('[Job] Ошибка:', err));

  // Планируем ежечасный запуск
  cron.schedule(CRON_SCHEDULE, async () => {
    console.log('[Cron] Запуск по расписанию:', new Date().toISOString());
    await runTariffJob().catch((err) => console.error('[Job] Ошибка:', err));
  });

  console.log(`[App] Планировщик запущен. Расписание: ${CRON_SCHEDULE}`);
}

main().catch((err) => {
  console.error('[App] Критическая ошибка:', err);
  process.exit(1);
});
