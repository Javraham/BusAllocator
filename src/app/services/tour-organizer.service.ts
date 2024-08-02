import { Injectable } from '@angular/core';
import {Bus} from "./bus";
import {Passenger} from "../typings/passenger";
import {IBus} from "../typings/BusSelection";
import {BusService} from "./bus.service";

@Injectable({
  providedIn: 'root'
})
export class TourOrganizerService {
  buses: Bus[];
  constructor() {
    this.buses = []
  }

  setBuses(buses: Bus[]) {
    this.buses = buses
  }

  getBuses(){
    return this.buses
  }

  printResult() {
    let htmlResult = ""
    for (const bus of this.buses) {
      htmlResult += `<p style="font-weight: 700">Bus (${bus.busId})</p>
                     <p style="font-weight: 700">Pickups: ${bus.getCurrentLoad()} TOTAL PAX</p>`
      const pickupLocations = bus.getPassengersByPickupLocations();
      console.log(pickupLocations)

      Array.from(pickupLocations.entries()).forEach(val => {
        htmlResult += `<p>${val[0]} - ${val[1]} PAX</p>`
      })
        const noBoatPassengers = bus.getNumOfNoBoatPassengers();
        if (noBoatPassengers[0] > 0 || noBoatPassengers[1] > 0) {
          htmlResult += "<br/>"

          if(noBoatPassengers[1] !== 0){
            htmlResult += `<p>No Boat - <strong>${noBoatPassengers[0]} Adults, ${noBoatPassengers[1]} Children</strong></p>`
          }
          else{
            htmlResult += `<p>No Boat - <strong>${noBoatPassengers[0]} Adults</strong></p>`
          }
          bus.getNoBoatPassengers().forEach(passenger => {
            if(passenger.numOfChildren !== 0){
              htmlResult += `<p>${passenger.firstName} ${passenger.lastName} - ${passenger.numOfPassengers - passenger.numOfChildren} Adults, ${passenger.numOfChildren} Children</p>`
            }
            else{
              htmlResult += `<p>${passenger.firstName} ${passenger.lastName} - ${passenger.numOfPassengers - passenger.numOfChildren} Adults</p>`
            }
            console.log(`${passenger.firstName} ${passenger.lastName} - ${passenger.numOfPassengers - passenger.numOfChildren} Adults, ${passenger.numOfChildren} Children`);
          });
        }
        htmlResult += '<br/>'
        const boatPassengers = bus.getNumOfBoatPassengers();
        if (boatPassengers[0] > 0 || boatPassengers[1] > 0) {
          if(boatPassengers[1] !== 0){
            htmlResult += `<p>Boat Cruise - <strong>${boatPassengers[0]} Adults, ${boatPassengers[1]} Children</strong></p>`
          }
          else{
            htmlResult += `<p>Boat Cruise - <strong>${boatPassengers[0]} Adults</strong></p>`
          }
          console.log(`\nBoat Cruise - ${boatPassengers[0]} Adults, ${boatPassengers[1]} Children`);
          bus.getBoatPassengers().forEach(passenger => {
            if(passenger.numOfChildren !== 0){
              htmlResult += `<p>${passenger.firstName} ${passenger.lastName} - ${passenger.numOfPassengers - passenger.numOfChildren} Adults, ${passenger.numOfChildren} Children</p>`
            }
            else{
              htmlResult += `<p>${passenger.firstName} ${passenger.lastName} - ${passenger.numOfPassengers - passenger.numOfChildren} Adults</p>`
            }
            console.log(`${passenger.firstName} ${passenger.lastName} - ${passenger.numOfPassengers - passenger.numOfChildren} Adults, ${passenger.numOfChildren} Children`);
          });
        }
        htmlResult += '<br/>'
    }
    return htmlResult
  }
}
