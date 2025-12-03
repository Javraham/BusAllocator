import { Injectable } from '@angular/core';
import {IEmail} from "../typings/IEmail";
import {ISMS} from "../typings/ISMS";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {IWhatsApp} from "../typings/IWhatsApp";

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  url: string = 'http://localhost:3000/'
  constructor(private http: HttpClient) { }

  getSentMessages(date: string, collection: string): Observable<any>{
    let params = new HttpParams().set('date', date).set('collection', collection);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get(`${this.url}getMessagesByDate`, {params, headers})
  }

  sendSMS(SMSObject: ISMS, endpoint: string): Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-api-key': 'hjkuwnndjw23=dkl'
    });

    const phoneNumbers = SMSObject.passengers.map(passenger => passenger.phoneNumber).filter(number => number != null).map(number => {
      return number.replace(/[a-zA-Z\s]/g, '');
    })
    console.log(phoneNumbers)
    const body = {
      passengerPhoneNumbers: phoneNumbers,
      message: SMSObject.message,
      location: SMSObject.location,
      date: SMSObject.date,
      tourTime: SMSObject.tourTime
    }

    return this.http.post(`${this.url}${endpoint}`, body, {headers, responseType: 'json'}).pipe(
      catchError(error => {
        console.error('Error occurred:', error.error);
        return throwError(() => new Error(error.error.message));
      })
    );
  }

  sendWhatsApp(WhatsAppObject: IWhatsApp, endpoint: string): Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-api-key': 'hjkuwnndjw23=dkl'
    });

    const phoneNumbers = WhatsAppObject.passengers.map(passenger => passenger.phoneNumber).filter(number => number != null).map(number => {
      return number.replace(/[a-zA-Z\s]/g, '');
    })
    console.log(phoneNumbers)
    const body = {
      passengerPhoneNumbers: phoneNumbers,
      locationString: WhatsAppObject.locationString,
      mapLink: WhatsAppObject.mapLink,
      location: WhatsAppObject.location,
      date: WhatsAppObject.date,
      tourTime: WhatsAppObject.tourTime,
      whatsappTemplate: WhatsAppObject.whatsappTemplate
    }

    console.log(body)

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
    const emailAddresses = emailObject.passengers.map(passenger => passenger.email).filter(email => email != null || email != undefined)
    const body = {
      passengerEmailAddresses: emailAddresses,
      body: emailObject.body,
      subject: emailObject.subject,
      date: emailObject.date,
      location: emailObject.location,
      tourTime: emailObject.tourTime
    }
    return this.http.post(`${this.url}send-email`, body, {headers, responseType: 'json'}).pipe(
      catchError(error => {
        console.error('Error occurred:', error);
        return throwError(() => new Error(error.error.message));
      })
    );
  }
}
