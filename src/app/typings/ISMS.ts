import {Passenger} from "./passenger";

export interface ISMS{
  passengers: Passenger[],
  message: string,
  date: string,
  location: string,
  tourTime?: string
}
