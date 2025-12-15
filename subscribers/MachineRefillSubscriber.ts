import { ISubscriber } from "./ISubsriber";
import { MachineRefillEvent } from "../events/MachineRefillEvent";
import { IMachineRepository } from "../infrastructure/machines/IMachineRepository";
import { IPublishSubscribeService } from "../infrastructure/pubsub/IPublishSubscribeService";
import { StockLevelOkEvent } from "../events/StockLevelOkEvent";
import { IEvent } from "../events/IEvent";

export class MachineRefillSubscriber implements ISubscriber {
  constructor(private readonly machineRepository : IMachineRepository, private readonly pubSubService : IPublishSubscribeService) {}


  handle(event: IEvent): void {
    if (!(event instanceof MachineRefillEvent)) {
        return;
    }

    const targetMachine = this.machineRepository.getMachineById(event.machineId());

    if (targetMachine) {
        try {
            const { passedLowThreshold } = targetMachine.refillStock(event.getRefillQuantity());

            console.log(`----- Machine ${targetMachine.id} refilled ${event.getRefillQuantity()} item(s). New stock level: ${targetMachine.getStockLevel()} -----`);
            
            if (passedLowThreshold) {
                const stockOkEvent = new StockLevelOkEvent(targetMachine.id, targetMachine.getStockLevel());
                this.pubSubService.publish(stockOkEvent);
            }
        } catch (error) {
            console.error(`!!! Refill failed for Machine ${targetMachine.id}: ${error} !!!`);
        }
    }
  }
}