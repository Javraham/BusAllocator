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
    return this.http.post(`${this.url}send-email`, emailObject, {headers, responseType: 'json'},)
  }

  check(): Observable<any>{
    return this.http.get(this.url, { responseType: 'text' })
  }

  check2(){
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': 'hjkuwnndjw23=dkl'
    };
    return fetch(this.url, {
      mode: "cors",
    })
  }
}
