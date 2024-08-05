import { Injectable } from '@angular/core';
import {Passenger} from "../typings/passenger";

@Injectable({
  providedIn: 'root'
})
export class PassengersService {

  constructor() { }

  getPassengersByTime(passengers: Passenger[]) {
    const map: Map<string, Passenger[]> = new Map<string, Passenger[]>();
    for(const passenger of passengers){
      if(map.has(passenger.startTime)){
        let passengers = map.get(passenger.startTime) as Passenger[]
        passengers.push(passenger)
        map.set(passenger.startTime, passengers)
      }
      else{
        map.set(passenger.startTime, [passenger])
      }
    }
    return map
  }

  getTotalPassengers(passengers: Passenger[] | undefined){
    if(passengers)
      return passengers.reduce((total, passenger) => total + passenger.numOfPassengers, 0);

    return 0
  }

  getPassengersByPickupLocations(passengers: Passenger[]): Map<string, number> {
    const pickupLocations: Map<string, number> = new Map<string, number>();
    for (const passenger of passengers) {
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

  getBoatPassengers(passengers: Passenger[]): Passenger[] {
    return passengers.filter(passenger => passenger.hasBoat && !passenger.hasJourney);
  }

  getJourneyPassengers(passengers: Passenger[]): Passenger[] {
    return passengers.filter(passenger => passenger.hasJourney);
  }

  getNumOfBoatPassengers(passengers: Passenger[]): [number, number] {
    const adults = this.getBoatPassengers(passengers).reduce((total, passenger) => total + (passenger.numOfPassengers - passenger.numOfChildren), 0);
    const children = this.getBoatPassengers(passengers).reduce((total, passenger) => total + passenger.numOfChildren, 0);
    return [adults, children];
  }

  getNumOfJourneyPassengers(passengers: Passenger[]): [number, number] {
    const adults = this.getJourneyPassengers(passengers).reduce((total, passenger) => total + (passenger.numOfPassengers - passenger.numOfChildren), 0);
    const children = this.getJourneyPassengers(passengers).reduce((total, passenger) => total + passenger.numOfChildren, 0);
    return [adults, children];
  }

  getNumOfNoBoatPassengers(passengers: Passenger[]): [number, number] {
    const adults = this.getNoBoatPassengers(passengers).reduce((total, passenger) => total + (passenger.numOfPassengers - passenger.numOfChildren), 0);
    const children = this.getNoBoatPassengers(passengers).reduce((total, passenger) => total + passenger.numOfChildren, 0);
    return [adults, children];
  }

  getNoBoatPassengers(passengers: Passenger[]): Passenger[] {
    return passengers.filter(passenger => !passenger.hasBoat);
  }
}
