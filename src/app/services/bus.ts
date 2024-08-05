import {Passenger} from "../typings/passenger";
import {IBus} from "../typings/BusSelection";

export class Bus {
  busId: string = '';
  capacity: number = 0;
  color: string = '';
  passengers: Passenger[] = [];

  constructor(busId: string, capacity: number, color: string) {
    this.busId = busId;
    this.capacity = capacity;
    this.passengers = [];
    this.color = color;
  }

  getPassengers() {
    return this.passengers
  }

  setBusDetails(busId: string, capacity: number) {
    this.busId = busId;
    this.capacity = capacity;
  }
  getCurrentLoad(): number {
    return this.passengers.reduce((total, passenger) => total + passenger.numOfPassengers, 0);
  }

  removePassenger(passenger: Passenger) {
    this.passengers = this.passengers.filter(val => val != passenger)
  }

  addPassenger(passenger: Passenger): boolean {
    if (this.getCurrentLoad() + passenger.numOfPassengers <= this.capacity) {
      this.passengers.push(passenger);
      return true;
    } else {
      return false;
    }
  }

  getPassengersByPickupLocations(): Map<string, number> {
    const pickupLocations: Map<string, number> = new Map<string, number>();
    for (const passenger of this.passengers) {
      if (!pickupLocations.has(passenger.pickup)) {
        pickupLocations.set(passenger.pickup, passenger.numOfPassengers);
      } else {
        let numOfPassengers = pickupLocations.get(passenger.pickup) as number
        pickupLocations.set(passenger.pickup, numOfPassengers + passenger.numOfPassengers);
      }
    }

    return pickupLocations

    try {
      const extractTime = (location: string): Date => {
        const timeStr = location.split(" - ")[0].split(" ").slice(1).join(" ");
        return new Date(`1970-01-01T${timeStr}:00`);
      };

      return new Map(
        Object.keys(pickupLocations)
          .sort((a, b) => extractTime(a).getTime() - extractTime(b).getTime())
          .map(key => [key, pickupLocations.get(key) as number])
      );

    } catch {
      return pickupLocations;
    }
  }

  getBoatPassengers(): Passenger[] {
    return this.passengers.filter(passenger => passenger.hasBoat);
  }

  getNumOfBoatPassengers(): [number, number] {
    const adults = this.getBoatPassengers().reduce((total, passenger) => total + (passenger.numOfPassengers - passenger.numOfChildren), 0);
    const children = this.getBoatPassengers().reduce((total, passenger) => total + passenger.numOfChildren, 0);
    return [adults, children];
  }

  getNumOfNoBoatPassengers(): [number, number] {
    const adults = this.getNoBoatPassengers().reduce((total, passenger) => total + (passenger.numOfPassengers - passenger.numOfChildren), 0);
    const children = this.getNoBoatPassengers().reduce((total, passenger) => total + passenger.numOfChildren, 0);
    return [adults, children];
  }

  getNoBoatPassengers(): Passenger[] {
    return this.passengers.filter(passenger => !passenger.hasBoat);
  }

}
