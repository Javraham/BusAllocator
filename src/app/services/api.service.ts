import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';
import {FetchBookingDataOptions} from "../typings/fetch-data-booking-options";
import {Passenger} from "../typings/passenger";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url: string = "https://api.bokun.io";
  constructor() { }

  generateBokunSignature(date: string, accessKey: string, httpMethod: string, path: string, secretKey: string): string {
    // Concatenate the required values
    const message = `${date}${accessKey}${httpMethod}${path}`;

    // Create HMAC-SHA1 signature
    const hmac = CryptoJS.HmacSHA1(message, secretKey);
    return CryptoJS.enc.Base64.stringify(hmac);
  }

  fetchBokunData = async (props: FetchBookingDataOptions): Promise<any> => {
    const { endpoint, accessKey, secretKey, httpMethod, date, body } = props;
    const url = `${this.url}${endpoint}`;

    const headers = {
      'Content-Type': 'application/json',
      'X-Bokun-Date': date,
      'X-Bokun-Signature': this.generateBokunSignature(date, accessKey, httpMethod, endpoint, secretKey),
      'X-Bokun-AccessKey': accessKey
    };

    try {
      const options: RequestInit = {
        method: httpMethod,
        headers
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(url, options);

      if (!response.ok) {
        console.log("error occurred!");
      }

      return await response.json();

    } catch (error) {
      console.error('Failed to fetch Bokun data:', error);
      return null;
    }
  };

  async getPassengers(date: string, fetchOptions: FetchBookingDataOptions){

    fetchOptions.body = {
      "startDateRange": {
        "from": date,
        "includeLower": true,
        "includeUpper": true,
        "to": date
      }
    }

    const jsonData = await this.fetchBokunData(fetchOptions);

    const data: Passenger[] = await jsonData.items
      .filter((val: any) => val.productBookings[0]?.status !== "CANCELLED")
      .map((val: any) => {
        const productBooking = val.productBookings[0];

        const numOfPassengers = productBooking?.totalParticipants;
        const pickup = productBooking?.fields?.pickupPlace?.title ?? productBooking?.fields?.pickupPlaceDescription;
        const hasBoat = productBooking?.rateTitle.includes("Boat");
        const hasJourney = productBooking?.rateTitle.includes("AND");
        const startTime = productBooking?.fields?.startTimeStr;

        const numOfChildren = productBooking?.fields?.priceCategoryBookings.reduce((total: number, val: any) => {
          return val?.pricingCategory.ticketCategory === "CHILD" ? total + 1 : total
        }, 0)

        return {
          confirmationCode: val.confirmationCode,
          startTime,
          firstName: val.customer.firstName,
          lastName: val.customer.lastName,
          email: val.customer.email,
          numOfPassengers,
          pickup,
          hasBoat,
          numOfChildren,
          hasJourney
        };
      });

    const map: Map<string, number> = new Map<string, number>
    for(const data_set of data){
      if(map.has(data_set.startTime)){
        let passengers = map.get(data_set.startTime) as number
        passengers += data_set.numOfPassengers;
        map.set(data_set.startTime, passengers)
      }
      else{
        map.set(data_set.startTime, data_set.numOfPassengers)
      }
    }
    const totalPassengers: number[] = jsonData.items.reduce((total: number, current: any) => {
      if(current.productBookings[0].status !== 'CANCELLED'){
        return total + current.productBookings[0].totalParticipants
      }
      else{
        return total
      }
    }, 0)

    console.log(totalPassengers)
    console.log(map)
    // console.log(data)
    return data
  }
}
