import { Injectable } from '@angular/core';
import {IBus} from "../typings/BusSelection";
import {Bus} from "./bus";

@Injectable({
  providedIn: 'root'
})
export class BusService {
  buses: Bus[] = []
  constructor() { }

  // addBuses(buses: IBus[]) {
  //   buses.forEach(busInfo => {
  //     const bus = new Bus();
  //     bus.setBusDetails(busInfo.busId, busInfo.capacity)
  //     bus.passengers = []
  //     console.log("bus#", bus)
  //     this.buses.push(bus)
  //   })
  // }

  getBuses(): Bus[]{
    return this.buses
  }

  resetBuses() {
    this.buses = []
  }
}
