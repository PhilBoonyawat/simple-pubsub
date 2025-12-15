import { IEvent } from "./IEvent";

export class StockLevelOkEvent implements IEvent {
  constructor(private readonly _machineId: string, private readonly _stockLevel: number) {}

  machineId() : string {
    return this._machineId;
  }

  type() : string {
    return 'stock_level_ok';
  }

  getStockLevel() : number {
    return this._stockLevel;
  }
}