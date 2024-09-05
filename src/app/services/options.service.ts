import { Injectable } from '@angular/core';
import {IPickup} from "../typings/ipickup";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {IBookingOptions} from "../typings/IBookingOptions";

@Injectable({
  providedIn: 'root'
})
export class OptionsService {

  options: IBookingOptions[] = []
  url: string = 'http://localhost:3000/'
  constructor(private http: HttpClient) { }

  setOptions() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const locationsResponse = this.http.get<any>(`${this.url}options/getOptions`, {headers})
    locationsResponse.subscribe({
      next: (response) => {
        this.options = response.data
        console.log(response.data)
      },
      error: err => console.log(err)
    })
  }
}
