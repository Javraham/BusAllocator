import {Bus} from "./bus";
import {Passenger} from "../typings/passenger";
import {IBus} from "../typings/BusSelection";

export class TourOrganizer {
  buses: Bus[];
  pickupLocations: Map<string, Passenger[]>;

  constructor(buses: IBus[]) {
    this.buses = buses.map(bus => new Bus(bus.busId, bus.capacity));
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
        startTime
      };

      if (!this.pickupLocations.has(pickup)) {
        this.pickupLocations.set(pickup, []);
      }
      const passengers = this.pickupLocations.get(pickup) as Passenger[];
      passengers.push(passenger)
      this.pickupLocations.set(pickup, passengers);
    }
  }

  allocatePassengersBackup(): boolean {
    try {
      const sortedLocations = Array.from(this.pickupLocations).sort((a, b) => {
        return this.getNumOfPassengersByPickup(b[0])-this.getNumOfPassengersByPickup(a[0])
      });
      const unallocatedPassengers: Passenger[] = []
      console.log("Sorted", sortedLocations)
      for (const [location, passengers] of sortedLocations) {
        const availableBuses = this.buses.filter(bus =>
          bus.getCurrentLoad() + this.getNumOfPassengersByPickup(location) <= bus.capacity)
          .sort((a, b) => a.getCurrentLoad() - b.getCurrentLoad() || a.capacity - b.capacity);
        if(availableBuses[0]){
          passengers.forEach(passenger => availableBuses[0].addPassenger(passenger));
          console.log(availableBuses[0], availableBuses[0].getCurrentLoad())
        }
        else{
          passengers.forEach(passenger => unallocatedPassengers.push(passenger));
        }

      }
      console.log("unallocated", unallocatedPassengers)
      return true;
    } catch (error) {
      console.error(error)
      return false
    }
  }

  allocatePassengers(): boolean {
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
        return this.allocatePassengersBackup()
      }

      return success;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  printResult(): void {
    for (const bus of this.buses) {
      console.log(`\nBus: ${bus.busId}\nPickups: ${bus.getCurrentLoad()} TOTAL PAX`);
      const pickupLocations = bus.getPassengersByPickupLocations();

      for (const [pickup, numOfTickets] of Object.entries(pickupLocations)) {
        console.log(`${pickup} - ${numOfTickets} PAX`);
      }

      const noBoatPassengers = bus.getNumOfNoBoatPassengers();
      if (noBoatPassengers[0] > 0 || noBoatPassengers[1] > 0) {
        console.log(`\nNo boat - ${noBoatPassengers[0]} Adults, ${noBoatPassengers[1]} Children`);
        bus.getNoBoatPassengers().forEach(passenger => {
          console.log(`${passenger.firstName} ${passenger.lastName} - ${passenger.numOfPassengers - passenger.numOfChildren} Adults, ${passenger.numOfChildren} Children`);
        });
      }

      const boatPassengers = bus.getNumOfBoatPassengers();
      if (boatPassengers[0] > 0 || boatPassengers[1] > 0) {
        console.log(`\nBoat Cruise - ${boatPassengers[0]} Adults, ${boatPassengers[1]} Children`);
        bus.getBoatPassengers().forEach(passenger => {
          console.log(`${passenger.firstName} ${passenger.lastName} - ${passenger.numOfPassengers - passenger.numOfChildren} Adults, ${passenger.numOfChildren} Children`);
        });
      }
    }
  }
}
