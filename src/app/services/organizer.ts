import {Bus} from "./bus";
import {Passenger} from "../typings/passenger";
import {IBus} from "../typings/BusSelection";

export class TourOrganizer {
  buses: Bus[];
  pickupLocations: Map<string, Passenger[]>;

  constructor(buses: IBus[]) {
    this.buses = buses.map(bus => new Bus(bus.busId, bus.capacity, bus.color));
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
    const randomElement = sortedArray[index];
    const [location, passengerList] = randomElement;
    const result = sortedArray.filter(pickup => pickup[0] !== location)
    function splitArrayIntoTwoEvenly(array: Passenger[]): [Passenger[], Passenger[]] {
      // Calculate the midpoint index
      const midpoint = Math.ceil(array.length / 2);

      // Split the array into two subarrays
      const subarray1 = array.slice(0, midpoint);
      const subarray2 = array.slice(midpoint);

      return [subarray1, subarray2];
    }

    const splitList = splitArrayIntoTwoEvenly(passengerList)
    result.push([location, splitList[0]])
    result.push([location, splitList[1]])

    return result.sort((a, b) => this.getNumOfPassengersByPickup(b[0]) - this.getNumOfPassengersByPickup(a[0]))
  }

  allocatePassengers(sortedLocations = this.getSortedLocation(), numOfTries: number = 0, isSplit: boolean = false): [boolean, boolean] {
    try {
      const totalCapacities = this.buses.reduce((bus, currentBus) => bus + currentBus.capacity, 0)
      const totalPassengers = sortedLocations.reduce((val, current) => {
        return val + current[1].reduce((passenger, currentPassenger) => passenger + currentPassenger.numOfPassengers, 0)
      }, 0)

      if(totalCapacities + 1 < totalPassengers || numOfTries == sortedLocations.length-1){
        return [false, false]
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

        const [location, passengers] = sortedLocations[index];
        const availableBuses = this.buses.filter(bus =>
          bus.getCurrentLoad() + this.getNumOfPassengersByPickup(location) <= bus.capacity);

        shuffle(availableBuses); // Shuffle the available buses

        for (const bus of availableBuses) {
          if (bus.getCurrentLoad() + this.getNumOfPassengersByPickup(location) <= bus.capacity) {
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
      let split = false;
      if (!success) {
        const busN1 = this.buses.find(val => val.busId === 'N1');

        if (busN1 && busN1.capacity === 13) {
          busN1.capacity = 14;
          console.log(this.buses)
          return this.allocatePassengers()
        }
        else{
          console.error("Unable to allocate all passengers.");
          split = true
          return this.allocatePassengers(this.getSplitSortedLocation(numOfTries), numOfTries+1, true)
        }
        // return this.allocatePassengersBackup()
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
