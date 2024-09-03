import { Injectable } from '@angular/core';
import {IBus} from "../typings/BusSelection";
import {Bus} from "./bus";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class BusService {
  buses: IBus[] = []
  url: string = 'https://phpstack-128687-4846902.cloudwaysapps.com/'
  constructor(private http: HttpClient) { }

  setBuses() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const busResponse = this.http.get<any>(`${this.url}getBuses`, {headers})
    busResponse.subscribe({
      next: (response) => {
        this.buses = response.data
      },
      error: err => console.log(err)
    })
  }

  resetBuses() {
    this.buses = []
  }
}
