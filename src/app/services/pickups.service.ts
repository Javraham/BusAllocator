import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {IPickup} from "../typings/ipickup";
import {Observable} from "rxjs";
import {IBookingOptions} from "../typings/IBookingOptions";

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
      },
      error: err => console.log(err)
    })
  }

  addPickupLocation(newPickupLocation: IPickup): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    console.log(newPickupLocation)
    return this.http.post<any>(`${this.url}pickups/addPickupLocation`, newPickupLocation, {headers})
  }

  deletePickupLocation(docId: string): Observable<any> {
    return this.http.delete<void>(`${this.url}pickups/deletePickupLocation/${docId}`)
  }

  updatePickupLocation(body: IPickup): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.put<any>(`${this.url}pickups/updatePickupLocation`, body, {headers})
  }

  getPickupLocations(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<any>(`${this.url}pickups/getPickupLocations`, {headers})
  }
}
