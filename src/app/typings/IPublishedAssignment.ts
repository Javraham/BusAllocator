import { Passenger } from './passenger';

/**
 * Represents a published driver assignment for the driver portal
 */
export interface IPublishedAssignment {
    docId?: string;
    date: string;                    // e.g., "2025-12-23"
    publishedAt?: string;             // ISO timestamp
    assignments: IBusAssignment[];   // Array of bus-driver-passengers
}

/**
 * Individual bus assignment with driver and passengers
 */
export interface IBusAssignment {
    busId: string;
    driverId: string;
    driverName: string;
    time: string;                    // The time slot (e.g., "9:00 AM")
    tourName?: string;               // The tour name from tours service
    notes?: string;                  // Optional notes for the driver
    passengers: IAssignedPassenger[];
}

/**
 * Simplified passenger info for the driver's view
 */
export interface IAssignedPassenger {
    confirmationCode: string;
    firstName: string;
    lastName: string;
    pickup: string;
    numOfPassengers: number;
    numOfChildren: number;
    phoneNumber: string;
    option: string;
    status: string;
}
