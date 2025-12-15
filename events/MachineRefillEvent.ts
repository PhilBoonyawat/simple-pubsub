import { IEvent } from "./IEvent";

export class MachineRefillEvent implements IEvent {
  constructor(private readonly _refill: number, private readonly _machineId: string) {}

  machineId(): string {
    return this._machineId;
  }

  type(): string {
    return 'refill';
  }

  getRefillQuantity(): number {
    return this._refill;
  }
}