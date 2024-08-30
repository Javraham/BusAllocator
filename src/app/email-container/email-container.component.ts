import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IEmail} from "../typings/IEmail";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MessageService} from "../services/message.service";
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
  @Output() updateSentMessages = new EventEmitter<any>();

  constructor(private emailService: MessageService) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      subject: new FormControl(this.emailInfo.subject, [Validators.required]),
      body: new FormControl(this.emailInfo.body, [Validators.required])
    });
    this.passengers = this.emailInfo.passengers
  }

  run() {
    console.log(this.passengers)
  }

  addEmail() {
    this.loading = true
    this.emailService.addEmails(this.emailInfo.date, this.emailInfo.location).subscribe({
      next: (response) => {
        this.successMsg = response.message
        this.loading = false
        this.updateSentMessages.emit(response.data)
      },
      error: (error) => {
        this.successMsg = ""
        this.errorMsg = error.error == undefined ? "Failed to connect to server." : error.error.errorMsg;
        this.loading = false;
      },
    })
  }

  getEmailBodyFromChild(): IEmail {
    return {
      passengers: this.passengers,
      body: this.form.value.body,
      subject: this.form.value.subject,
      date: this.emailInfo.date,
      location: this.emailInfo.location
    }
  }

  sendSMS(endpoint: string, event?: any): Promise<any> {
      if(event) event.preventDefault(); // Prevent form submission
      return new Promise((resolve, reject) => {
        if (this.form.invalid || this.passengers.length === 0) {
          this.form.markAllAsTouched();
          reject(undefined)
          return;
        }
        this.loading = true;
        this.emailService.sendSMS({
          passengers: this.passengers,
          message: this.form.value.body,
          date: this.emailInfo.date,
          location: this.emailInfo.location
        },endpoint).subscribe({
          next: (response) => {
            this.errorMsg = ""
            this.successMsg = response.message
            this.loading = false
            this.updateSentMessages.emit(response.data)
            console.log(response.failed)
            resolve(undefined)
          },
          error: (error) => {
            this.successMsg = ""
            console.log(error)
            this.errorMsg = error.message == undefined ? "Failed to connect to server." : error.message;
            this.loading = false;
            reject(undefined)
          },
        })
      })
    }


    onSubmit() {
    // This will handle the generic form submission if needed
    console.log('Form Submitted');
  }


  sendEmail(event?: any): Promise<any> {
    if(event) event.preventDefault(); // Prevent form submission
    return new Promise((resolve, reject) => {
      if (this.form.invalid || this.passengers.length === 0) {
        this.form.markAllAsTouched();
        reject(undefined)
        return;
      }
      this.loading = true;
      this.emailService.sendEmail({
        passengers: this.passengers,
        body: this.form.value.body,
        subject: this.form.value.subject,
        date: this.emailInfo.date,
        location: this.emailInfo.location
      }).subscribe({
        next: (response) => {
          this.errorMsg = ""
          this.successMsg = response.message
          this.loading = false
          console.log(response)
          this.updateSentMessages.emit(response.data)
          resolve(undefined)
        },
        error: (error) => {
          this.successMsg = ""
          this.errorMsg = error.error == undefined ? "Failed to connect to server." : error.error.errorMsg;
          this.loading = false;
          reject(undefined)
        },
      })
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
