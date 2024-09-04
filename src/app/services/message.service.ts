import { Injectable } from '@angular/core';
import {IEmail} from "../typings/IEmail";
import {ISMS} from "../typings/ISMS";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  url: string = 'http://localhost:3000/'
  constructor(private http: HttpClient) { }

  getSentMessages(date: string, collection: string): Observable<any>{
    console.log(date)
    let params = new HttpParams().set('date', date).set('collection', collection);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get(`${this.url}getMessagesByDate`, {params, headers})
  }

  addEmails(date: string, location: string): Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const body = {
      date,
      location,
      emails: ['avrahamj@mcmaster.ca']
    }
    return this.http.post(`${this.url}add-emails`, body, {headers}).pipe(
      catchError(error => {
        console.error('Error occurred:', error);
        return throwError(() => new Error('Failed to send email. Please check your connection.'));
      })
    );
  }

  sendAllEmails(emailObjectArray: IEmail[]): Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-api-key': 'hjkuwnndjw23=dkl'
    });

    const locations = emailObjectArray.map(emailObject => {
      return {
        ...emailObject,
        passengerEmailAddresses: ['avrahamjonathan@gmail.com']
      }
    })

    console.log(locations)

    return this.http.post(`${this.url}send-emails-to-all`, {locations}, {headers}).pipe(
      catchError(error => {
        console.error('Error occurred:', error);
        return throwError(() => new Error('Failed to send email. Please check your connection.'));
      })
    );
  }

  sendSMS(SMSObject: ISMS, endpoint: string): Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-api-key': 'hjkuwnndjw23=dkl'
    });

    const phoneNumbers = SMSObject.passengers.map(passenger => passenger.phoneNumber)
    console.log(phoneNumbers)
    const body = {
      passengerPhoneNumbers: phoneNumbers,
      message: SMSObject.message,
      location: SMSObject.location,
      date: SMSObject.date
    }

    return this.http.post(`${this.url}${endpoint}`, body, {headers, responseType: 'json'}).pipe(
      catchError(error => {
        console.error('Error occurred:', error.error);
        return throwError(() => new Error(error.error.message));
      })
    );
  }

  sendEmail(emailObject: IEmail): Observable<any> {
    console.log(emailObject)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-api-key': 'hjkuwnndjw23=dkl'
    });
    const emailAddresses = emailObject.passengers.map(passenger => passenger.email)
    console.log(emailObject.passengers.map(passenger => passenger.email))
    const body = {
      passengerEmailAddresses: ["avrahamjonathan@gmail.com"],
      body: emailObject.body,
      subject: emailObject.subject,
      date: emailObject.date,
      location: emailObject.location
    }
    return this.http.post(`${this.url}send-email`, body, {headers, responseType: 'json'}).pipe(
      catchError(error => {
        console.error('Error occurred:', error);
        return throwError(() => new Error('Failed to send email. Please check your connection.'));
      })
    );
  }
}
