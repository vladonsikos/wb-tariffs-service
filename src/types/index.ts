export interface WBBoxTariff {
  boxDeliveryAndStorageExpr: string;
  boxDeliveryBase: string;
  boxDeliveryLiter: string;
  boxStorageBase: string;
  boxStorageLiter: string;
  warehouseName: string;
}

export interface WBTariffsResponse {
  response: {
    data: {
      warehouseList: WBBoxTariff[];
      dtNextBox: string;
      dtTillMax: string;
    };
  };
}

export interface TariffRecord {
  id?: number;
  warehouse_name: string;
  box_delivery_and_storage_expr: string;
  box_delivery_base: number;
  box_delivery_liter: number;
  box_storage_base: number;
  box_storage_liter: number;
  date: string;
  created_at?: Date;
  updated_at?: Date;
}
