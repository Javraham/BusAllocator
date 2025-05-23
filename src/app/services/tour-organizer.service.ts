import { Injectable } from '@angular/core';
import {Bus} from "./bus";
import {Passenger} from "../typings/passenger";
import {IBus} from "../typings/BusSelection";
import {BusService} from "./bus.service";
import {PassengersService} from "./passengers.service";
import {PickupsService} from "./pickups.service";
import {OptionsService} from "./options.service";
import {catchError, lastValueFrom, map, Observable, of} from "rxjs";
import {IPickup} from "../typings/ipickup";

@Injectable({
  providedIn: 'root'
})
export class TourOrganizerService {
  buses: Map<string, Bus[]>;
  TimeToPassengersMap: Map<string, Passenger[]>;
  constructor(private passengerService: PassengersService, private pickupService: PickupsService, private optionsService: OptionsService) {
    this.buses = new Map<string, Bus[]>();
    this.TimeToPassengersMap = new Map<string, Passenger[]>();
  }

  setBuses(startTime: string, buses: Bus[]) {
    this.buses.set(startTime, buses);
  }

  setTimeToPassengersMap(map: Map<string, Passenger[]>) {
    this.TimeToPassengersMap = map;
  }

  getBusesByTime(time: string) {
    return this.buses.get(time);
  }


  resetBuses() {
    this.buses = new Map<string, Bus[]>();
  }

  resetBusesForTime(time: string) {
    this.buses.delete(time);
  }

  async printResult() {
    const response = await lastValueFrom(this.pickupService.getPickupLocations())
    console.log(response)
    const optionsResponse = await lastValueFrom(this.optionsService.getOptions())
    console.log(optionsResponse)
    const sortedOptions = optionsResponse.data.sort((optionA: any, optionB: any) => optionA.priority - optionB.priority).map((option: any) => option.abbrev)
    const getPickupAbbrev = (passenger: Passenger) => {
      const pickupAbbrev = response.data.find((pickup: IPickup) => passenger.pickup.toLowerCase().includes(pickup.name.toLowerCase()))?.abbreviation;
      return pickupAbbrev ? ` (${pickupAbbrev}) ` : '';
    }

    let htmlResult = ""
    const sortedMap = new Map([...this.buses.entries()].sort((a, b) => {
      const timeA = a[0];
      const timeB = b[0];
      return timeA.localeCompare(timeB);
    }));
    for(const time of sortedMap.keys()) {
      const busList = this.buses.get(time) as Bus[]
      if (busList.length > 0) {
        htmlResult += `<p style="font-weight: 700; font-size: 1.2em">${parseInt(time[0]) == 0 ? time.slice(1) : time} - ${busList.reduce((total, current:Bus) => total + current.getCurrentLoad(), 0)} TOTAL PAX</p>`
      }
      for (const bus of busList) {
        htmlResult += `<p style="font-weight: 700">Bus (${bus.busId})</p>
                     <p style="font-weight: 700">Pickups: ${bus.getCurrentLoad()} TOTAL PAX</p>`
        const pickupLocations = this.passengerService.getTotalPassengersByPickupLocations(bus.getPassengers());

        Array.from(pickupLocations.entries()).forEach(val => {
          htmlResult += `<p>${val[0]} - ${val[1]} PAX</p>`
        })

        for(const option of this.passengerService.getOptionsToPassengers(bus.passengers, sortedOptions).keys()){
          htmlResult += "<br/>"
          const [numOfAdults, numOfChildren] = this.passengerService.getNumOfPassengersForOption(option, bus.passengers)
          htmlResult += `<p>${option} - <strong>${numOfAdults} ${numOfAdults !== 1 ? "Adults" : "Adult"}${numOfChildren > 0 ? ', ' + numOfChildren + ' ' + (numOfChildren !== 1 ? "Children" : "Child") : ""}</strong></p>`
          this.passengerService.getOptionsToPassengers(bus.getPassengers(), sortedOptions).get(option)?.forEach((passenger: Passenger) => {
            const numOfAdults = passenger.numOfPassengers - passenger.numOfChildren;
            if (passenger.numOfChildren !== 0) {
              htmlResult += `<p>${passenger.firstName} ${passenger.lastName}${getPickupAbbrev(passenger)} - ${passenger.phoneNumber ?? "No Phone Number"} - ${numOfAdults} ${numOfAdults !== 1  ? "Adults" : "Adult"}, ${passenger.numOfChildren} ${passenger.numOfChildren == 1 ? "Child" : "Children"}</p>`
            } else {
              htmlResult += `<p>${passenger.firstName} ${passenger.lastName}${getPickupAbbrev(passenger)} - ${passenger.phoneNumber ?? "No Phone Number"} - ${numOfAdults} ${numOfAdults !== 1  ? "Adults" : "Adult"}</p>`
            }
          })
        }
        htmlResult += '<hr style="background-color: grey; height: 1px"/>'
      }
    }
    const sortedTimeMap = new Map([...this.TimeToPassengersMap.entries()].sort((a, b) => {
      const timeA = a[0];
      const timeB = b[0];
      return timeA.localeCompare(timeB);
    }));
    for(const time of sortedTimeMap.keys()){
      if(!this.buses.has(time)){
        htmlResult += `<p style="font-weight: 700; font-size: 1.2em">${parseInt(time[0]) == 0 ? time.slice(1) : time} - ${this.passengerService.getTotalPassengers(this.TimeToPassengersMap.get(time))} TOTAL PAX</p>`
        const pickupLocations = this.passengerService.getTotalPassengersByPickupLocations(this.TimeToPassengersMap.get(time) as Passenger[]);

        Array.from(pickupLocations.entries()).forEach(val => {
          htmlResult += `<p>${val[0]} - ${val[1]} PAX</p>`
        })

        for(const option of this.passengerService.getOptionsToPassengers(this.TimeToPassengersMap.get(time) as Passenger[], sortedOptions).keys()){
          htmlResult += "<br/>"
          const [numOfAdults, numOfChildren] = this.passengerService.getNumOfPassengersForOption(option, this.TimeToPassengersMap.get(time) as Passenger[])
          htmlResult += `<p>${option} - <strong>${numOfAdults} ${numOfAdults !== 1 ? "Adults" : "Adult"}${numOfChildren > 0 ? ', ' + numOfChildren + ' ' + (numOfChildren !== 1 ? "Children" : "Child") : ""}</strong></p>`
          this.passengerService.getOptionsToPassengers(this.TimeToPassengersMap.get(time) as Passenger[]).get(option)?.forEach((passenger: Passenger) => {
            const numOfAdults = passenger.numOfPassengers - passenger.numOfChildren;
            if (passenger.numOfChildren !== 0) {
              htmlResult += `<p>${passenger.firstName} ${passenger.lastName}${getPickupAbbrev(passenger)} - ${passenger.phoneNumber ?? "No Phone Number"} - ${numOfAdults} ${numOfAdults !== 1  ? "Adults" : "Adult"}, ${passenger.numOfChildren} ${passenger.numOfChildren == 1 ? "Child" : "Children"}</p>`
            } else {
              htmlResult += `<p>${passenger.firstName} ${passenger.lastName}${getPickupAbbrev(passenger)} - ${passenger.phoneNumber ?? "No Phone Number"} - ${numOfAdults} ${numOfAdults !== 1  ? "Adults" : "Adult"}</p>`
            }
          })
        }
        htmlResult += '<hr style="background-color: grey; height: 1px"/>'
      }
    }
    return htmlResult
  }
}
