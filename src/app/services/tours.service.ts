import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ITour } from "../typings/itour";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class ToursService {
    tours: ITour[] = []
    url: string = 'https://phpstack-128687-4846902.cloudwaysapps.com/'
    constructor(private http: HttpClient) { }

    setTours() {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });

        const toursResponse = this.http.get<any>(`${this.url}tours/getTours`, { headers })
        toursResponse.subscribe({
            next: (response) => {
                this.tours = response.data
            },
            error: err => console.log(err)
        })
    }

    addTour(newTour: ITour): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        console.log(newTour)
        return this.http.post<any>(`${this.url}tours/addTour`, newTour, { headers })
    }

    deleteTour(docId: string): Observable<any> {
        return this.http.delete<void>(`${this.url}tours/deleteTour/${docId}`)
    }

    updateTour(body: ITour): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        console.log(body)
        return this.http.put<any>(`${this.url}tours/updateTour`, body, { headers })
    }

    getTours(): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });

        return this.http.get<any>(`${this.url}tours/getTours`, { headers })
    }
}
