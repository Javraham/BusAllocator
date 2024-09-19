import { Injectable } from '@angular/core';
import {IPickup} from "../typings/ipickup";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {IBookingOptions} from "../typings/IBookingOptions";
import {Observable} from "rxjs";
import {IBus} from "../typings/BusSelection";

@Injectable({
  providedIn: 'root'
})
export class OptionsService {

  options: IBookingOptions[] = []
  url: string = 'http://localhost:3000/'
  constructor(private http: HttpClient) { }

  addOption(newOption: IBookingOptions): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<any>(`${this.url}options/addOption`, newOption, {headers})
  }

  deleteOption(docId: string): Observable<any> {
    return this.http.delete<void>(`${this.url}options/deleteOption/${docId}`)
  }

  updateOption(body: IBookingOptions): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.put<any>(`${this.url}options/updateOption`, body, {headers})
  }

  setOptions() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const optionsResponse = this.http.get<any>(`${this.url}options/getOptions`, {headers})
    optionsResponse.subscribe({
      next: (response) => {
        this.options = response.data
      },
      error: err => console.log(err)
    })
  }
  getOptions() : Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<any>(`${this.url}options/getOptions`, {headers})
  }
}
