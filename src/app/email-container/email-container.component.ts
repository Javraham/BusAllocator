import {Component, Input, SimpleChanges} from '@angular/core';
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
  form: FormGroup = new FormGroup<any>({});

  constructor(private emailService: EmailService) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      to: new FormControl(this.emailInfo.passengers.reduce((past, current) => past + ' ' + current.firstName, ""), Validators.required),
      subject: new FormControl(this.emailInfo.subject, [Validators.required]),
      body: new FormControl(this.emailInfo.body, [Validators.required])
    });
  }


  sendEmail() {
    this.emailService.sendEmail({passengers: this.emailInfo.passengers, body: this.form.value.body, subject: this.form.value.subject}).subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error),
    })
  }
}
