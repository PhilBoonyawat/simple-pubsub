import { IEvent } from "./IEvent";

export class LowStockWarningEvent implements IEvent {
  constructor(private readonly _machineId: string, private readonly _stockLevel: number) {}

  machineId() : string {
    return this._machineId;
  }

  type() : string {
    return 'low_stock_warning';
  }

  getStockLevel() : number {
    return this._stockLevel;
  }
}