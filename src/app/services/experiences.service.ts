import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { IExperience } from "../typings/ipickup";

@Injectable({
  providedIn: 'root'
})

export class ExperiencesService {
  experiences: IExperience[] = []
  url: string = 'https://phpstack-128687-4846902.cloudwaysapps.com/'
  constructor(private http: HttpClient) { }

  setExperiences() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const response = this.http.get<any>(`${this.url}experiences/getExperiences`, { headers })
    response.subscribe({
      next: (response) => {
        this.experiences = response.data
      },
      error: err => console.log(err)
    })
  }

  addExperience(newExperience: IExperience): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<any>(`${this.url}experiences/addExperience`, newExperience, { headers })
  }

  deleteExperience(docId: string): Observable<any> {
    return this.http.delete<void>(`${this.url}experiences/deleteExperience/${docId}`)
  }

  updateExperience(body: IExperience): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.put<any>(`${this.url}experiences/updateExperience`, body, { headers })
  }

  getExperiences(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<any>(`${this.url}experiences/getExperiences`, { headers })
  }
}
