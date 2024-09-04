import { BusService } from "../services/bus.service";

export interface IBus {
  docId: string,
  busId: string,
  capacity: number,
  color: string
}
