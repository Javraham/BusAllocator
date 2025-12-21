import { Injectable } from '@angular/core';
import { IBus } from "../typings/BusSelection";
import { Bus } from "./bus";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class BusService {
  buses: IBus[] = []
  url: string = 'http://localhost:3000/'
  constructor(private http: HttpClient) { }

  setBuses() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const busResponse = this.http.get<any>(`${this.url}buses/getBuses`, { headers })
    busResponse.subscribe({
      next: (response) => {
        this.buses = response.data.sort((a: any, b: any) => {
          return parseInt(a.busId.substring(1)) - parseInt(b.busId.substring(1))
        })
      },
      error: err => console.log(err)
    })
  }

  updateBus(body: IBus): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.put<any>(`${this.url}buses/updateBus`, body, { headers })
  }

  deleteBus(docId: string): Observable<any> {
    return this.http.delete<void>(`${this.url}buses/deleteBus/${docId}`)
  }

  addBus(newBus: IBus): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    console.log(newBus)
    return this.http.post<any>(`${this.url}buses/addBus`, newBus, { headers })
  }

  getBuses(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<any>(`${this.url}buses/getBuses`, { headers })
  }

  resetBuses() {
    this.buses = []
  }
}
