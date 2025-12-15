import { ISubscriber } from "./ISubsriber";
import { MachineSaleEvent } from "../events/MachineSaleEvent";
import { IEvent } from "../events/IEvent";
import { IMachineRepository } from "../infrastructure/machines/IMachineRepository";
import { IPublishSubscribeService } from "../infrastructure/pubsub/IPublishSubscribeService";
import { LowStockWarningEvent } from "../events/LowStockWarningEvent";

export class MachineSaleSubscriber implements ISubscriber {
  constructor(private readonly machineRepository : IMachineRepository, private readonly pubSubService : IPublishSubscribeService) {}


  handle(event: IEvent): void {
    if (!(event instanceof MachineSaleEvent)) {
        return;
    }

    const targetMachine = this.machineRepository.getMachineById(event.machineId());

    if (targetMachine) {
        try {
            const { crossedLowThreshold } = targetMachine.sellStock(event.getSoldQuantity());
        
            console.log(`----- Machine ${targetMachine.id} sold ${event.getSoldQuantity()} item(s). New stock level: ${targetMachine.getStockLevel()} -----`);
            
            if (crossedLowThreshold) {
                const lowStockEvent = new LowStockWarningEvent(targetMachine.id, targetMachine.getStockLevel());
                this.pubSubService.publish(lowStockEvent);
            }
        } catch (error) {
            console.error(`!!! Sale failed for Machine ${targetMachine.id}: ${error} !!!`);
        }
        
    }
  }
}