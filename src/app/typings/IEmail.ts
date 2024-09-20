import {Passenger} from "./passenger";

export interface IEmail {
  passengers: Passenger[],
  subject: string,
  body: string,
  formattedDate?: string
  date: string,
  location: string,
  tourTime?: string
}
