import { Machine } from "./infrastructure/machines/Machine";
import { MachineRepository } from "./infrastructure/machines/MachineRepository";
import { PublishSubscribeService } from "./infrastructure/pubsub/PublishSubsriberService";
import { MachineSaleSubscriber } from "./subscribers/MachineSaleSubscriber";
import { MachineRefillSubscriber } from "./subscribers/MachineRefillSubscriber";
import { StockWarningSubscriber } from "./subscribers/StockWarningSubscriber";
import { MachineSaleEvent } from "./events/MachineSaleEvent";
import { MachineRefillEvent } from "./events/MachineRefillEvent"; 
import { IEvent } from "./events/IEvent";


// helpers
const randomMachine = (): string => {
  const random = Math.random() * 3;
  if (random < 1) {
    return '001';
  } else if (random < 2) {
    return '002';
  }
  return '003';

}

const eventGenerator = (): IEvent => {
  const random = Math.random();
  if (random < 0.5) {
    const saleQty = Math.random() < 0.5 ? 1 : 2; // 1 or 2
    return new MachineSaleEvent(saleQty, randomMachine());
  } 
  const refillQty = Math.random() < 0.5 ? 3 : 5; // 3 or 5
  return new MachineRefillEvent(refillQty, randomMachine());
}


(async () => {
  // create 3 machines with a quantity of 10 stock
  const machines = [ new Machine('001', 10), new Machine('002', 10), new Machine('003', 10) ];
  const machineRepository = new MachineRepository(machines);

  const pubSubService = new PublishSubscribeService();

  // initialize subscribers
  const saleSubscriber = new MachineSaleSubscriber(machineRepository, pubSubService);
  const refillSubscriber = new MachineRefillSubscriber(machineRepository, pubSubService);
  const warningSubscriber = new StockWarningSubscriber(machineRepository);

  // subscribe to events
  pubSubService.subscribe('sale', saleSubscriber);
  pubSubService.subscribe('refill', refillSubscriber);
  pubSubService.subscribe('low_stock_warning', warningSubscriber);
  pubSubService.subscribe('stock_level_ok', warningSubscriber);

  console.log('----- Initial stock levels: -----');

  machineRepository.getAllMachines().forEach(machine => {
    console.log(`Machine ${machine.id}: ${machine.getStockLevel()} units`);
  });

  console.log('\n--- Processing Events ---\n');

  const events = [1,2,3,4,5].map(i => eventGenerator());

  // publish the events
  events.forEach(e => pubSubService.publish(e));
})();
