import {Component, Input, SimpleChanges} from '@angular/core';
import {IEmail} from "../typings/IEmail";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {EmailService} from "../services/email.service";
import {HttpClientModule} from "@angular/common/http";
import {NgForOf} from "@angular/common";
import {first} from "rxjs";
import {Passenger} from "../typings/passenger";

@Component({
  selector: 'app-email-container',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
  ],
  templateUrl: './email-container.component.html',
  styleUrl: './email-container.component.css'
})
export class EmailContainerComponent {
  @Input() emailInfo !: IEmail;
  form: FormGroup = new FormGroup<any>({});
  passengers: Passenger[] = []


  constructor(private emailService: EmailService) {
  }

  ngOnInit() {
    console.log(this.emailInfo.passengers)
    this.form = new FormGroup({
      subject: new FormControl(this.emailInfo.subject, [Validators.required]),
      body: new FormControl(this.emailInfo.body, [Validators.required])
    });
    this.passengers = this.emailInfo.passengers
  }


  sendEmail() {
    this.emailService.sendEmail({passengers: this.passengers, body: this.form.value.body, subject: this.form.value.subject}).subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error),
    })
  }

  removePassenger(pax: Passenger) {
    const index = this.passengers.findIndex(passenger => passenger.confirmationCode === pax.confirmationCode)
    console.log(index)
    if(index !== -1){
      this.passengers.splice(index, 1)
    }
    console.log(this.passengers)
  }

  restorePassengers() {
    this.passengers = this.emailInfo.passengers
  }
}
