import { IMachineRepository } from "./IMachineRepository";
import { Machine } from "./Machine";

export class MachineRepository implements IMachineRepository {
  private machinesMap : Map<string, Machine>;

  constructor(machines : Machine[]) {
    this.machinesMap = new Map(machines.map(machine => [machine.id, machine]));
  }

  getAllMachines() : Machine[] {
    const machineArray: Machine[] = [];
    this.machinesMap.forEach((machine) => {
      machineArray.push(machine);
    });
    return machineArray;
  }

  getMachineById(id: string) : Machine | undefined {
    return this.machinesMap.get(id);
  }
}