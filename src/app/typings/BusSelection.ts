import { BusService } from "../services/bus.service";

export interface IBus {
  docId?: string,
  busId: string,
  capacity: number,
  sortOrder?: number,
  color?: string,
  assignedDriverId?: string  // Reference to driver for current assignment
}

