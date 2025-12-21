import { Injectable } from '@angular/core';
import { EmailTemplate, IExperience } from "../typings/ipickup";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EmailTemplatesService {

  templates: EmailTemplate[] = []
  url: string = 'http://localhost:3000/'
  constructor(private http: HttpClient) { }

  setEmailTemplates() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const response = this.http.get<any>(`${this.url}email-templates/getEmailTemplates`, { headers })
    response.subscribe({
      next: (response) => {
        this.templates = response.data
      },
      error: err => console.log(err)
    })
  }

  addTemplate(newTemplate: EmailTemplate): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<any>(`${this.url}email-templates/addEmailTemplate`, newTemplate, { headers })
  }

  deleteTemplate(docId: string): Observable<any> {
    return this.http.delete<void>(`${this.url}email-templates/deleteEmailTemplate/${docId}`)
  }

  updateTemplate(body: EmailTemplate): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.put<any>(`${this.url}email-templates/updateEmailTemplate`, body, { headers })
  }

  getEmailTemplates(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<any>(`${this.url}email-templates/getEmailTemplates`, { headers })
  }
}
