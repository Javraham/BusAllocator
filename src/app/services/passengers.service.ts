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

    // return pickupLocations

    try {
      const extractTime = (str: any) => {
        const timeMatch = str.match(/\b(\d{1,2}):(\d{2})\s*(AM|PM)\b/);
        if (timeMatch) {
          let [ , hours, minutes, period ] = timeMatch;
          hours = parseInt(hours);
          minutes = parseInt(minutes);
          if (period === "PM" && hours !== 12) hours += 12;
          if (period === "AM" && hours === 12) hours = 0;
          return hours * 60 + minutes; // Convert time to minutes since midnight
        }
        return 0;
      }

      return new Map(
        Array.from(pickupLocations.keys())
          .sort((a, b) => extractTime(a) - extractTime(b))
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
