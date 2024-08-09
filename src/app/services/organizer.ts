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
        phoneNumber
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

  allocatePassengers(sortedLocations = this.getSortedLocation()): boolean {
    try {

      console.log(sortedLocations)

      const totalCapacities = this.buses.reduce((bus, currentBus) => bus + currentBus.capacity, 0)
      const totalPassengers = sortedLocations.reduce((val, current) => {
        return val + current[1].reduce((passenger, currentPassenger) => passenger + currentPassenger.numOfPassengers, 0)
      }, 0)

      if(totalCapacities + 1 < totalPassengers){
        return false
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

        // const specialBus = this.buses.find(bus => bus.busId === 'N1');
        // if (specialBus) {
        //   const originalCapacity = specialBus.capacity;
        //   specialBus.capacity += 1; // Temporarily increase capacity
        //
        //   // Retry allocation
        //   const retrySuccess = allocate(index);
        //
        //   // Revert capacity back to original
        //   specialBus.capacity = originalCapacity;
        //
        //   console.log("buses splitted")
        //   return retrySuccess;
        // }
        return false
      }

      const success = allocate(0);

      if (!success) {
        const busN1 = this.buses.find(val => val.busId === 'N1');

        if (busN1 && busN1.capacity === 13) {
          busN1.capacity = 14;
          console.log(this.buses)
          return this.allocatePassengers()
        }
        else{
          console.error("Unable to allocate all passengers.");
        }
        // return this.allocatePassengersBackup()
      }

      return success;
    } catch (error) {
      console.error(error);
      return false;
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
