import { ISubscriber } from "./ISubsriber";
import { IEvent } from "../events/IEvent";
import { IMachineRepository } from "../infrastructure/machines/IMachineRepository";
import { LowStockWarningEvent } from "../events/LowStockWarningEvent";
import { StockLevelOkEvent } from "../events/StockLevelOkEvent";

export class StockWarningSubscriber implements ISubscriber {
  constructor(private readonly machineRepository : IMachineRepository) {}

  handle(event: IEvent): void {
    const targetMachine = this.machineRepository.getMachineById(event.machineId());
    
    if (targetMachine) {
        if (event instanceof LowStockWarningEvent) {
            console.log(`------ Machine ${event.machineId()} has low stock level of ${targetMachine.getStockLevel()} ------`);
        } else if (event instanceof StockLevelOkEvent) {
            console.log(`------ Machine ${event.machineId()} stock level is back to normal at ${targetMachine.getStockLevel()} ------`);
        }
    }
  }
}