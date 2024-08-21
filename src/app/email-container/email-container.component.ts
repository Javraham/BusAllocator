import {Component, Input} from '@angular/core';
import {IEmail} from "../typings/IEmail";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {EmailService} from "../services/email.service";
import {NgForOf, NgIf} from "@angular/common";
import {Passenger} from "../typings/passenger";

@Component({
  selector: 'app-email-container',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf,
  ],
  templateUrl: './email-container.component.html',
  styleUrl: './email-container.component.css'
})
export class EmailContainerComponent {
  @Input() emailInfo !: IEmail;
  form: FormGroup = new FormGroup<any>({});
  passengers: Passenger[] = []
  successMsg: string = '';
  errorMsg: string = '';
  loading = false;

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
    if (this.form.invalid || this.passengers.length === 0) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.emailService.sendEmail({passengers: this.passengers, body: this.form.value.body, subject: this.form.value.subject}).subscribe({
      next: (response) => {
        this.successMsg = response.message
        this.loading = false
      },
      error: (error) => {
        this.errorMsg = error.error.errorMsg;
        this.loading = false;
      },
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
