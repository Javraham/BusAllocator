import {Component, Input} from '@angular/core';
import {IEmail} from "../typings/IEmail";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {EmailService} from "../services/email.service";
import {HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-email-container',
  standalone: true,
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './email-container.component.html',
  styleUrl: './email-container.component.css'
})
export class EmailContainerComponent {
  @Input() emailInfo !: IEmail;
  form: FormGroup = new FormGroup({
    to: new FormControl('', Validators.required),
    subject: new FormControl('', [Validators.required]),
    body: new FormControl('', [Validators.required])
  });

  constructor(private emailService: EmailService) {
  }


  sendEmail() {
    this.emailService.sendEmail({passengerEmailAddresses: ['avrahamjonathan@gmail.com'], body: this.form.value.body, subject: this.form.value.subject}).subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error),
    })
  }
}
