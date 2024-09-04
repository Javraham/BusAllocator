import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {IPickup} from "../typings/ipickup";

@Injectable({
  providedIn: 'root'
})
export class PickupsService {
  pickupLocations: IPickup[] = []
  url: string = 'http://localhost:3000/'
  constructor(private http: HttpClient) { }

  setPickupLocations() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const locationsResponse = this.http.get<any>(`${this.url}pickups/getPickupLocations`, {headers})
    locationsResponse.subscribe({
      next: (response) => {
        this.pickupLocations = response.data
        console.log(response.data)
      },
      error: err => console.log(err)
    })
  }
}
