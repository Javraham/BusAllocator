import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPublishedAssignment } from '../typings/IPublishedAssignment';

@Injectable({
    providedIn: 'root'
})
export class PublishedAssignmentsService {
    private url: string = 'http://localhost:3000/';

    constructor(private http: HttpClient) { }

    /**
     * Publish a new driver assignment to the backend
     */
    publishAssignment(assignment: IPublishedAssignment): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return this.http.post<any>(`${this.url}assignments/publish`, assignment, { headers });
    }

    /**
     * Get all published assignments for a specific date
     */
    getAssignmentsByDate(date: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return this.http.get<any>(`${this.url}assignments/byDate/${date}`, { headers });
    }

    /**
     * Get assignments for a specific driver on a date (used by driver portal)
     */
    getAssignmentsByDriver(driverId: string, date: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return this.http.get<any>(`${this.url}assignments/byDriver/${driverId}/${date}`, { headers });
    }

    /**
     * Check if assignments have been published for a date
     */
    checkPublishedStatus(date: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return this.http.get<any>(`${this.url}assignments/status/${date}`, { headers });
    }
}
