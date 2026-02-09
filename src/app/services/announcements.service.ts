import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AnnouncementsService {
    private url = 'http://localhost:3000/';

    constructor(private http: HttpClient) { }

    getAnnouncement(): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return this.http.get<any>(`${this.url}general-announcement`, { headers });
    }

    updateAnnouncement(message: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return this.http.post<any>(`${this.url}general-announcement`, { message }, { headers });
    }
}
