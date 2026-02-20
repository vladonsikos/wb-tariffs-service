import axios from 'axios';
import { WBTariffsResponse, WBBoxTariff } from '../types';

const WB_API_URL = 'https://common-api.wildberries.ru/api/v1/tariffs/box';

export async function fetchBoxTariffs(date: string): Promise<WBBoxTariff[]> {
  const token = process.env.WB_API_TOKEN;
  if (!token) throw new Error('WB_API_TOKEN не задан');

  const response = await axios.get<WBTariffsResponse>(WB_API_URL, {
    headers: {
      Authorization: token,
    },
    params: {
      date,
    },
  });

  return response.data.response.data.warehouseList;
}
