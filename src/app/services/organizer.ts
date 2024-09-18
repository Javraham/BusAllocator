import {Bus} from "./bus";
import {Passenger} from "../typings/passenger";
import {IBus} from "../typings/BusSelection";
import {catchError, map, Observable, of} from "rxjs";

export class TourOrganizer {
  buses: Bus[];
  pickupLocations: Map<string, Passenger[]>;

  constructor(buses: IBus[]) {
    this.buses = buses.map(bus => new Bus(bus.busId, bus.capacity, bus.color || 'black'));
    this.pickupLocations = new Map();
  }

  getNumOfPassengersByPickup(pickup: string): number {
    const passengers = this.pickupLocations.get(pickup) || [];
    return passengers.reduce((total, passenger) => total + passenger.numOfPassengers, 0);
  }


  loadData(data: Passenger[]): void {
    for (const passengerData of data) {
      const pickup = passengerData['pickup'];
      const firstName = passengerData['firstName'];
      const lastName = passengerData['lastName'];
      const email = passengerData['email'];
      const numOfPassengers = passengerData['numOfPassengers'];
      const numOfChildren = passengerData['numOfChildren'];
      const hasBoat = passengerData['hasBoat'];
      const hasJourney = passengerData['hasJourney'];
      const startTime = passengerData['startTime'];
      const confirmationCode = passengerData['confirmationCode']
      const phoneNumber = passengerData['phoneNumber']
      const option = passengerData['option']


      const passenger: Passenger = {
        confirmationCode,
        pickup,
        email,
        firstName,
        lastName,
        numOfChildren,
        hasBoat,
        numOfPassengers,
        hasJourney,
        startTime,
        phoneNumber,
        option
      };

      if (!this.pickupLocations.has(pickup)) {
        this.pickupLocations.set(pickup, []);
      }
      const passengers = this.pickupLocations.get(pickup) as Passenger[];
      passengers.push(passenger)
      this.pickupLocations.set(pickup, passengers);
    }
  }

  getSortedLocation() {
    return Array.from(this.pickupLocations).sort((a, b) => {
      return this.getNumOfPassengersByPickup(b[0]) - this.getNumOfPassengersByPickup(a[0]);
    });
  }

  getSplitSortedLocation(index: number) {
    const sortedArray = this.getSortedLocation();
    const [location, passengerList] = sortedArray[0];
    const result = sortedArray.filter(pickup => pickup[0] !== location)
    function splitArrayIntoTwoEvenly(array: Passenger[], index: number): [Passenger[], Passenger[]] {
      // Calculate the midpoint index
      const midpoint = Math.ceil(array.length / 2);

      // Split the array into two subarrays
      const subarray1 = array.slice(0, index);
      const subarray2 = array.slice(index);
      console.log([subarray1, subarray2])
      return [subarray1, subarray2];
    }

    const splitList = splitArrayIntoTwoEvenly(passengerList, index)
    result.push([location, splitList[0]])
    result.push([location, splitList[1]])

    return result.sort((a, b) => b[1].reduce((total, currentValue) => total + currentValue.numOfPassengers, 0) - a[1].reduce((total, currentValue) => total + currentValue.numOfPassengers, 0))
  }

  allocatePassengers(passengerToBusList: ([string, string])[], sortedLocations = this.getSortedLocation(), numOfTries: number = 0, isSplit: boolean = false ): [boolean, boolean] {
    try {
      const totalCapacities = this.buses.reduce((bus, currentBus) => bus + currentBus.capacity, 0)
      const totalPassengers = sortedLocations.reduce((val, current) => {
        return val + current[1].reduce((passenger, currentPassenger) => passenger + currentPassenger.numOfPassengers, 0)
      }, 0)
      console.log(totalPassengers, totalCapacities)

      if(totalCapacities < totalPassengers || numOfTries == this.getSortedLocation()[0][1].length){
        return [false, false]
      }

      for (const [passengerCode, busId] of passengerToBusList) {
        const bus = this.buses.find(bus => bus.busId === busId) as Bus;
        const locationWithPassenger = sortedLocations.find(([_, passengers]) =>
          passengers.some(passenger => passenger.confirmationCode === passengerCode)
        );

        if (locationWithPassenger) {
          const passengers = locationWithPassenger[1];
          const passenger = passengers.find(p => p.confirmationCode === passengerCode);

          if (passenger) {
            if(!bus.addPassenger(passenger)){
              return [false, false]
            }
          }
        }
      }
      const shuffle = (array: any[]) => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
      };

      const allocate = (index: number): boolean => {
        if (index >= sortedLocations.length) {
          return true;
        }

        let [location, passengers] = sortedLocations[index];

        if(passengerToBusList.length){
          passengers = passengers.filter(passenger => !passengerToBusList.map(item => item[0]).includes(passenger.confirmationCode))
          console.log("Passengers: ", passengers)
        }

        const availableBuses = this.buses.filter(bus =>
          bus.getCurrentLoad() + passengers.reduce((total, currentValue) => total+currentValue.numOfPassengers, 0) <= bus.capacity);

        shuffle(availableBuses); // Shuffle the available buses

        for (const bus of availableBuses) {
          if (bus.getCurrentLoad() + passengers.reduce((total, currentValue) => total+currentValue.numOfPassengers, 0) <= bus.capacity) {
            passengers.forEach(passenger => bus.addPassenger(passenger));
            if (allocate(index + 1)) {
              return true;
            }
            passengers.forEach(passenger => bus.removePassenger(passenger)); // Backtrack
          }
        }

        return false
      }

      const success = allocate(0);

      if (!success) {
        console.error("Unable to allocate all passengers.");
        return this.allocatePassengers(passengerToBusList, this.getSplitSortedLocation(numOfTries), numOfTries+1, true)
      }

      return [success, isSplit];
    } catch (error) {
      console.error(error);
      return [false, false];
    }
  }

  allocatePassengersBackup(): boolean {
    try {
      const sortedLocations = Array.from(this.pickupLocations).sort((a, b) => {
        return this.getNumOfPassengersByPickup(b[0]) - this.getNumOfPassengersByPickup(a[0]);
      });

      const allocate = (index: number): boolean => {
        if (index >= sortedLocations.length) {
          return true;
        }

        const [location, passengers] = sortedLocations[index];
        const availableBuses = this.buses.filter(bus =>
          bus.getCurrentLoad() + this.getNumOfPassengersByPickup(location) <= bus.capacity)
          .sort((a, b) => a.getCurrentLoad() - b.getCurrentLoad() || a.capacity - b.capacity);

        for (const bus of availableBuses) {
          if (bus.getCurrentLoad() + this.getNumOfPassengersByPickup(location) <= bus.capacity) {
            passengers.forEach(passenger => bus.addPassenger(passenger));
            if (allocate(index + 1)) {
              return true;
            }
            passengers.forEach(passenger => bus.removePassenger(passenger)); // Backtrack
          }
        }
        return false;
      };

      const success = allocate(0);

      if (!success) {
        console.error("Unable to allocate all passengers.");
        return false
      }

      return success;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

}
