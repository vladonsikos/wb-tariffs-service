import { google } from 'googleapis';
import { TariffRecord } from '../types';
import * as fs from 'fs';

const SHEET_NAME = 'stocks_coefs';

async function getAuth() {
  const credPath = process.env.GOOGLE_SERVICE_ACCOUNT_PATH || '/app/google-credentials.json';
  const credentials = JSON.parse(fs.readFileSync(credPath, 'utf-8'));

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return auth;
}

export async function updateSpreadsheet(
  spreadsheetId: string,
  tariffs: TariffRecord[]
): Promise<void> {
  const auth = await getAuth();
  const sheets = google.sheets({ version: 'v4', auth });

  // Заголовки таблицы
  const headers = [
    'Склад',
    'Доставка + хранение (выражение)',
    'Доставка (база), ₽',
    'Доставка (литр), ₽',
    'Хранение (база), ₽',
    'Хранение (литр), ₽',
    'Дата',
    'Обновлено',
  ];

  // Данные отсортированы по box_delivery_base (коэффициент) по возрастанию
  const rows = tariffs.map((t) => [
    t.warehouse_name,
    t.box_delivery_and_storage_expr,
    t.box_delivery_base,
    t.box_delivery_liter,
    t.box_storage_base,
    t.box_storage_liter,
    t.date,
    new Date().toISOString(),
  ]);

  const values = [headers, ...rows];

  // Очищаем лист и записываем данные
  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: `${SHEET_NAME}!A1:Z10000`,
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${SHEET_NAME}!A1`,
    valueInputOption: 'RAW',
    requestBody: { values },
  });

  console.log(`[Google Sheets] Таблица ${spreadsheetId} обновлена. Строк: ${rows.length}`);
}

export async function updateAllSpreadsheets(tariffs: TariffRecord[]): Promise<void> {
  const ids = (process.env.GOOGLE_SPREADSHEET_IDS || '').split(',').filter(Boolean);

  if (ids.length === 0) {
    console.warn('[Google Sheets] GOOGLE_SPREADSHEET_IDS не задан, пропускаем');
    return;
  }

  for (const id of ids) {
    try {
      await updateSpreadsheet(id.trim(), tariffs);
    } catch (err) {
      console.error(`[Google Sheets] Ошибка обновления таблицы ${id}:`, err);
    }
  }
}
