import { Machine } from "./Machine";

export interface IMachineRepository {
  getAllMachines() : Machine[];
  getMachineById(id: string) : Machine | undefined;
}
