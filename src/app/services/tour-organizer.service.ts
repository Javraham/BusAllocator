import { Injectable } from '@angular/core';
import {Bus} from "./bus";
import {Passenger} from "../typings/passenger";
import {IBus} from "../typings/BusSelection";
import {BusService} from "./bus.service";
import {PassengersService} from "./passengers.service";

@Injectable({
  providedIn: 'root'
})
export class TourOrganizerService {
  buses: Map<string, Bus[]>;
  TimeToPassengersMap: Map<string, Passenger[]>;
  constructor(private passengerService: PassengersService) {
    this.buses = new Map<string, Bus[]>();
    this.TimeToPassengersMap = new Map<string, Passenger[]>();
  }

  setBuses(startTime: string, buses: Bus[]) {
    this.buses.set(startTime, buses);
  }

  setTimeToPassengersMap(map: Map<string, Passenger[]>) {
    this.TimeToPassengersMap = map;
  }

  getBuses(){
    return this.buses
  }

  resetBuses() {
    this.buses = new Map<string, Bus[]>();
  }

  printResult() {
    let htmlResult = ""
    for(const time of this.buses.keys()) {
      const busList = this.buses.get(time) as Bus[]
      if (busList.length > 0) {
        htmlResult += `<p style="font-weight: 700; font-size: 1.2em">${parseInt(time[0]) == 0 ? time.slice(1) : time} - ${this.passengerService.getTotalPassengers(this.TimeToPassengersMap.get(time))} TOTAL PAX</p>`
      }
      for (const bus of busList) {
        htmlResult += `<p style="font-weight: 700">Bus (${bus.busId})</p>
                     <p style="font-weight: 700">Pickups: ${bus.getCurrentLoad()} TOTAL PAX</p>`
        const pickupLocations = this.passengerService.getPassengersByPickupLocations(bus.getPassengers());
        console.log(pickupLocations)

        Array.from(pickupLocations.entries()).forEach(val => {
          htmlResult += `<p>${val[0]} - ${val[1]} PAX</p>`
        })
        const noBoatPassengers = this.passengerService.getNumOfNoBoatPassengers(bus.getPassengers());
        if (noBoatPassengers[0] > 0 || noBoatPassengers[1] > 0) {
          htmlResult += "<br/>"

          if (noBoatPassengers[1] !== 0) {
            htmlResult += `<p>No Boat - <strong>${noBoatPassengers[0]} Adults, ${noBoatPassengers[1]} Children</strong></p>`
          } else {
            htmlResult += `<p>No Boat - <strong>${noBoatPassengers[0]} Adults</strong></p>`
          }
          this.passengerService.getNoBoatPassengers(bus.getPassengers()).forEach(passenger => {
            if (passenger.numOfChildren !== 0) {
              htmlResult += `<p>${passenger.firstName} ${passenger.lastName} - ${passenger.numOfPassengers - passenger.numOfChildren} Adults, ${passenger.numOfChildren} Children</p>`
            } else {
              htmlResult += `<p>${passenger.firstName} ${passenger.lastName} - ${passenger.numOfPassengers - passenger.numOfChildren} Adults</p>`
            }
            console.log(`${passenger.firstName} ${passenger.lastName} - ${passenger.numOfPassengers - passenger.numOfChildren} Adults, ${passenger.numOfChildren} Children`);
          });
        }
        htmlResult += '<br/>'
        const boatPassengers = this.passengerService.getNumOfBoatPassengers(bus.getPassengers());
        if (boatPassengers[0] > 0 || boatPassengers[1] > 0) {
          if (boatPassengers[1] !== 0) {
            htmlResult += `<p>Boat Cruise - <strong>${boatPassengers[0]} Adults, ${boatPassengers[1]} Children</strong></p>`
          } else {
            htmlResult += `<p>Boat Cruise - <strong>${boatPassengers[0]} Adults</strong></p>`
          }
          console.log(`\nBoat Cruise - ${boatPassengers[0]} Adults, ${boatPassengers[1]} Children`);
          this.passengerService.getBoatPassengers(bus.getPassengers()).forEach(passenger => {
            if (passenger.numOfChildren !== 0) {
              htmlResult += `<p>${passenger.firstName} ${passenger.lastName} - ${passenger.numOfPassengers - passenger.numOfChildren} Adults, ${passenger.numOfChildren} Children</p>`
            } else {
              htmlResult += `<p>${passenger.firstName} ${passenger.lastName} - ${passenger.numOfPassengers - passenger.numOfChildren} Adults</p>`
            }
            console.log(`${passenger.firstName} ${passenger.lastName} - ${passenger.numOfPassengers - passenger.numOfChildren} Adults, ${passenger.numOfChildren} Children`);
          });
        }
        htmlResult += '<hr style="background-color: grey; height: 1px"/>'
      }
    }
    console.log(this.buses)
    for(const time of this.TimeToPassengersMap.keys()){
      if(!this.buses.has(time)){
        htmlResult += `<p style="font-weight: 700; font-size: 1.2em">${parseInt(time) == 0 ? time.slice(1) : time} - ${this.passengerService.getTotalPassengers(this.TimeToPassengersMap.get(time))} TOTAL PAX</p>`
        const pickupLocations = this.passengerService.getPassengersByPickupLocations(this.TimeToPassengersMap.get(time) as Passenger[]);

        Array.from(pickupLocations.entries()).forEach(val => {
          htmlResult += `<p>${val[0]} - ${val[1]} PAX</p>`
        })
        const noBoatPassengers = this.passengerService.getNumOfNoBoatPassengers(this.TimeToPassengersMap.get(time) as Passenger[]);
        if (noBoatPassengers[0] > 0 || noBoatPassengers[1] > 0) {
          htmlResult += "<br/>"

          if (noBoatPassengers[1] !== 0) {
            htmlResult += `<p>No Boat - <strong>${noBoatPassengers[0]} Adults, ${noBoatPassengers[1]} Children</strong></p>`
          } else {
            htmlResult += `<p>No Boat - <strong>${noBoatPassengers[0]} Adults</strong></p>`
          }
          this.passengerService.getNoBoatPassengers(this.TimeToPassengersMap.get(time) as Passenger[]).forEach(passenger => {
            if (passenger.numOfChildren !== 0) {
              htmlResult += `<p>${passenger.firstName} ${passenger.lastName} - ${passenger.numOfPassengers - passenger.numOfChildren} Adults, ${passenger.numOfChildren} Children</p>`
            } else {
              htmlResult += `<p>${passenger.firstName} ${passenger.lastName} - ${passenger.numOfPassengers - passenger.numOfChildren} Adults</p>`
            }
          });
        }
        htmlResult += '<br/>'
        const boatPassengers = this.passengerService.getNumOfBoatPassengers(this.TimeToPassengersMap.get(time) as Passenger[]);
        if (boatPassengers[0] > 0 || boatPassengers[1] > 0) {
          if (boatPassengers[1] !== 0) {
            htmlResult += `<p>Boat Cruise - <strong>${boatPassengers[0]} Adults, ${boatPassengers[1]} Children</strong></p>`
          } else {
            htmlResult += `<p>Boat Cruise - <strong>${boatPassengers[0]} Adults</strong></p>`
          }
          this.passengerService.getBoatPassengers(this.TimeToPassengersMap.get(time) as Passenger[]).forEach(passenger => {
            if (passenger.numOfChildren !== 0) {
              htmlResult += `<p>${passenger.firstName} ${passenger.lastName} - ${passenger.numOfPassengers - passenger.numOfChildren} Adults, ${passenger.numOfChildren} Children</p>`
            } else {
              htmlResult += `<p>${passenger.firstName} ${passenger.lastName} - ${passenger.numOfPassengers - passenger.numOfChildren} Adults</p>`
            }
          });
        }
        htmlResult += '<hr style="background-color: grey; height: 1px"/>'
      }
    }
    return htmlResult
  }
}
