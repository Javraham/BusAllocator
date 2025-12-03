import {Passenger} from "./passenger";

export interface IWhatsApp{
  passengers: Passenger[],
  locationString: string,
  mapLink: string,
  date: string,
  location: string,
  tourTime?: string,
  whatsappTemplate?: string
}
