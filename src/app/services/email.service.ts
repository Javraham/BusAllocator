import { Injectable } from '@angular/core';
import {IEmail} from "../typings/IEmail";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  url: string = 'http://localhost:3000/'
  constructor(private http: HttpClient) { }

  sendEmail(emailObject: IEmail): Observable<any> {
    console.log(emailObject)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-api-key': 'hjkuwnndjw23=dkl'
    });
    console.log(emailObject.passengers.map(passenger => passenger.email))
    const body = {
      passengerEmailAddresses: ["avrahamjonathan@gmail.com"],
      body: emailObject.body,
      subject: emailObject.subject
    }
    return this.http.post(`${this.url}send-email`, body, {headers, responseType: 'json'}).pipe(
      catchError(error => {
        console.error('Error occurred:', error);
        return throwError(() => new Error('Failed to send email. Please check your connection.'));
      })
    );
  }
}
