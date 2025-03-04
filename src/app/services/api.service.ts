import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';
import {FetchBookingDataOptions} from "../typings/fetch-data-booking-options";
import {Passenger} from "../typings/passenger";
import {IBookingOptions} from "../typings/IBookingOptions";
import {OptionsService} from "./options.service";
import {lastValueFrom} from "rxjs";
import {ExperiencesService} from "./experiences.service";
import {IExperience} from "../typings/ipickup";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url: string = "https://api.bokun.io";
  fetchOptions: FetchBookingDataOptions = {
    endpoint: '/booking.json/product-booking-search',  // Replace with your actual endpoint
    date: new Date().toISOString().replace('T', ' ').substring(0, 19),
    httpMethod: "POST",
  };

  constructor(private optionsService: OptionsService, private experiencesService: ExperiencesService) { }

  generateBokunSignature(date: string, accessKey: string, httpMethod: string, path: string, secretKey: string): string {
    // Concatenate the required values
    const message = `${date}${accessKey}${httpMethod}${path}`;

    // Create HMAC-SHA1 signature
    const hmac = CryptoJS.HmacSHA1(message, secretKey);
    return CryptoJS.enc.Base64.stringify(hmac);
  }

  setKeys(form: any) {
    localStorage.setItem("access", form.accessKey);
    localStorage.setItem("secret", form.secretKey)
  }

  clearKeys() {
    localStorage.clear()
  }

  fetchBokunData = async (props: FetchBookingDataOptions): Promise<any> => {
    const { endpoint, httpMethod, date, body } = props;
    const url = `${this.url}${endpoint}`;

    const headers = {
      'Content-Type': 'application/json',
      'X-Bokun-Date': date,
      'X-Bokun-Signature': this.generateBokunSignature(date, localStorage.getItem("access") || "", httpMethod, endpoint, localStorage.getItem("secret") || ""),
      'X-Bokun-AccessKey': localStorage.getItem("access") || ""
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
        throw new Error('Error: Cannot load passengers')
      }

      return await response.json();

    } catch (error) {
      console.error('Failed to fetch Bokun data:', error);
      return null;
    }
  };

  async getPassengersFromBookingAPI(date: string, fetchOptions: FetchBookingDataOptions){

    fetchOptions.body = {
      "bookingStatuses": [
        "CONFIRMED",
      //   // "CART",
      //   // "REQUESTED",
      //   // "RESERVED",
      //   // "ARRIVED",
      //   // "NO_SHOW",
      //   // "REJECTED"
      ],
      "startDateRange": {
        "from": date,
        "includeLower": true,
        "includeUpper": true,
        "to": date
      }
    }

    try {
      const jsonData = await this.fetchBokunData(fetchOptions);
      console.log(jsonData)
      const data: Passenger[] = await jsonData.items
        .filter((val: any) => val.productBookings[0].status !== "CANCELLED")
        .map((val: any) => {
          console.log(val)
          const productBooking = val.productBookings[0];
          const numOfPassengers = productBooking?.totalParticipants;
          const pickup = productBooking?.fields?.pickupPlace?.title ?? productBooking?.fields?.pickupPlaceDescription;
          const hasBoat = productBooking?.rateTitle.includes("Boat");
          const hasJourney = productBooking?.rateTitle.includes("AND");
          const startTime = productBooking?.fields?.startTimeStr;
          const option = this.optionsService.options.find(option => productBooking?.rateTitle.toLowerCase().includes(option.option.toLowerCase()))?.abbrev || "Missing Option"
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
            hasJourney,
            phoneNumber: val.customer.phoneNumber,
            option
          };
        });

      const map: Map<string, number> = new Map<string, number>
      for (const data_set of data) {
        if (map.has(data_set.startTime)) {
          let passengers = map.get(data_set.startTime) as number
          passengers += data_set.numOfPassengers;
          map.set(data_set.startTime, passengers)
        } else {
          map.set(data_set.startTime, data_set.numOfPassengers)
        }
      }
      console.log(data)
      return data
    }

    catch (e){
      throw new Error("Problem with authentication: Please double check your access and secret keys")
    }
  }

  async getPassengersFromProductBookings(date: string, fetchOptions: FetchBookingDataOptions): Promise<Passenger[]> {

    const experiences = await lastValueFrom(this.experiencesService.getExperiences())

    console.log(experiences);
    // Prepare the two fetch options
    const confirmedFetchOptions = {
      ...fetchOptions,
      body: {
        ...fetchOptions.body,
        "bookingStatuses": ["CONFIRMED"],
        "startDateRange": {
          "from": date,
          "includeLower": true,
          "includeUpper": true,
          "to": date
        }
      }
    };

    const arrivedFetchOptions = {
      ...fetchOptions,
      body: {
        ...fetchOptions.body,
        "bookingStatuses": ["ARRIVED"],
        "startDateRange": {
          "from": date,
          "includeLower": true,
          "includeUpper": true,
          "to": date
        }
      }
    };

    const noShowFetchOptions = {
      ...fetchOptions,
      body: {
        ...fetchOptions.body,
        "bookingStatuses": ["NO_SHOW"],
        "startDateRange": {
          "from": date,
          "includeLower": true,
          "includeUpper": true,
          "to": date
        }
      }
    };

    try {
      // Execute both fetch calls in parallel
      const [jsonConfirmedData, jsonArrivedData, jsonNoShowData] = await Promise.all([
        this.fetchBokunData(confirmedFetchOptions),
        this.fetchBokunData(arrivedFetchOptions),
        this.fetchBokunData(noShowFetchOptions)
      ]);

      const combinedResults = [...jsonArrivedData.results, ...jsonConfirmedData.results, ...jsonNoShowData.results];
      const result = await lastValueFrom(this.optionsService.getOptions());

      console.log(combinedResults)
      return combinedResults
        .filter((val: any) => {
          const experienceFound = experiences.data.find((exp: IExperience) => exp.experienceId === val.productExternalId)
          console.log(experienceFound)
          if(!experienceFound){
            return val.status !== "CANCELLED"
          }

          return val.status !== "CANCELLED" && experienceFound.isSelected
        })
        .map((val: any) => {
          const productBooking = val.fields;
          const numOfPassengers = val.totalParticipants;
          const pickup = productBooking?.pickupPlace?.title ?? productBooking?.pickupPlaceDescription;
          const hasBoat = val.rateTitle.includes("Boat");
          const hasJourney = val.rateTitle.includes("AND");
          const startTime = productBooking?.startTimeStr;
          const numOfChildren = productBooking?.priceCategoryBookings.reduce((total: number, val: any) => {
            return val?.pricingCategory.ticketCategory === "CHILD" ? total + 1 : total;
          }, 0);
          const option = result.data.find((option: IBookingOptions)=> val?.rateTitle.toLowerCase().includes(option.option.toLowerCase()))?.abbrev || "Missing Option";

          return {
            confirmationCode: val.confirmationCode,
            startTime,
            firstName: val.customer.firstName,
            lastName: val.customer.lastName,
            email: val.customer.email,
            numOfPassengers,
            pickup: pickup == null || pickup == "" ? "NO PICKUP LOCATION ADDED" : pickup,
            hasBoat,
            numOfChildren,
            hasJourney,
            phoneNumber: val.customer.phoneNumber,
            option
          };
        });

    } catch (e) {
      console.error(e)
      throw new Error("Problem with authentication: Please double check your access and secret keys");
    }
  }
}
