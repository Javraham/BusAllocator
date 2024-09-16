import {Passenger} from "./passenger";

export interface IEmail {
  passengers: Passenger[],
  subject: string,
  body: string,
  bodyHTML ?: HTMLElement
  date: string,
  location: string,
  tourTime?: string
}
