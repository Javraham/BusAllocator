import { Injectable } from '@angular/core';
import {IEmail} from "../typings/IEmail";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

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
      passengerEmailAddresses: [],
      body: emailObject.body,
      subject: emailObject.subject
    }
    return this.http.post(`${this.url}send-email`, body, {headers, responseType: 'json'},)
  }
}
