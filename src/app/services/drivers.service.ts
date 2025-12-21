import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IDriver } from '../typings/IDriver';

@Injectable({
    providedIn: 'root'
})
export class DriversService {
    url: string = 'http://localhost:3000/'

    constructor(private http: HttpClient) { }

    getDrivers(): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        // User requested endpoint /drivers
        return this.http.get<any>(`${this.url}drivers/getDrivers`, { headers });
    }

    addDriver(driver: IDriver): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        // Assuming standard REST or similar to buses: POST /drivers
        return this.http.post<any>(`${this.url}drivers/addDriver`, driver, { headers });
    }

    updateDriver(driver: IDriver): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return this.http.put<any>(`${this.url}drivers/updateDriver`, driver, { headers });
    }

    deleteDriver(docId: string): Observable<any> {
        // Assuming RESTful delete: DELETE /drivers/:id
        return this.http.delete<void>(`${this.url}drivers/deleteDriver/${docId}`);
    }
}
