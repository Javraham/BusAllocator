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
  @Input() pickupPlace !: string;
  form: FormGroup = new FormGroup<any>({});
  passengers: Passenger[] = []
  successMsg: string = '';
  errorMsg: string = '';
  loadingSentEmail = false;
  loadingSentSMS = false;
  loadingSentWhatsapp = false;
  loadingAll = false;
  @Output() updateSentMessages = new EventEmitter<[any, string, string]>();

  constructor(private emailService: MessageService) {
  }

  ngOnInit() {
    let currentBody = this.emailInfo.body;
    const index = currentBody.indexOf("Map link:");
    if (index !== -1) {
      currentBody = currentBody.slice(0, index) + "Location: " + this.pickupPlace + '\n\n' + currentBody.slice(index);
    }
    this.form = new FormGroup({
      subject: new FormControl(this.emailInfo.subject, [Validators.required]),
      body: new FormControl(currentBody, [Validators.required])
    });
    this.passengers = this.emailInfo.passengers
  }

  run() {
    console.log(this.passengers)
  }

  sendSMS(endpoint: string, event?: any): Promise<any> {
    if(event) event.preventDefault(); // Prevent form submission

    const message = this.form.value.body + '\n\n **NO REPLY** \n' +
      'We can be contacted at book@tourstoniagarafalls.com or +1 416-792-7968'

    return new Promise((resolve, reject) => {
      if (this.form.invalid || this.passengers.length === 0) {
        this.form.markAllAsTouched();
        reject(undefined)
        return;
      }
      this.loadingSentSMS = true;
      this.emailService.sendSMS({
        passengers: this.passengers,
        message,
        date: this.emailInfo.date,
        location: this.emailInfo.location
      },endpoint).subscribe({
        next: (response) => {
          this.errorMsg = ""
          this.successMsg = response.message
          this.loadingSentSMS = false;
          console.log(response.data)
          this.updateSentMessages.emit([response.data, "sms", this.pickupPlace])
          resolve(undefined)
        },
        error: (error) => {
          console.error(error)
          this.successMsg = ""
          console.log(error)
          this.errorMsg = error.message == undefined ? "Failed to connect to server." : error.message;
          this.loadingSentSMS = false;
          reject(undefined)
        },
      })
    })
  }

  sendWhatsApp(endpoint: string, event?: any): Promise<any> {
    if(event) event.preventDefault(); // Prevent form submission

    const regex = /(https?:\/\/[^\s]+)/g;

    const matches = this.form.value.body.match(regex);
    const mapLink = matches ? matches[0] : null;

    return new Promise((resolve, reject) => {
      if (this.form.invalid || this.passengers.length === 0) {
        this.form.markAllAsTouched();
        reject(undefined)
        return;
      }
      this.loadingSentWhatsapp = true;
      this.emailService.sendWhatsApp({
        passengers: this.passengers,
        locationString: this.pickupPlace,
        mapLink,
        date: this.emailInfo.date,
        location: this.emailInfo.location
      },endpoint).subscribe({
        next: (response) => {
          this.errorMsg = ""
          this.successMsg = response.message
          this.loadingSentWhatsapp = false;
          console.log(response.data)
          this.updateSentMessages.emit([response.data, "whatsapp", this.pickupPlace])
          resolve(undefined)
        },
        error: (error) => {
          console.error(error)
          this.successMsg = ""
          console.log(error)
          this.errorMsg = error.message == undefined ? "Failed to connect to server." : error.message;
          this.loadingSentWhatsapp = false;
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
      this.loadingSentEmail = true;
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
          this.loadingSentEmail = false
          console.log(response)
          this.updateSentMessages.emit([response.data, "email", this.pickupPlace])
          resolve(undefined)
        },
        error: (error) => {
          this.successMsg = ""
          this.errorMsg = error.error == undefined ? "Failed to connect to server." : error.error.errorMsg;
          this.loadingSentEmail = false;
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

  async sendAll(event?: any) {
    if(event) event.preventDefault();
    this.loadingAll = true
    try{
      await Promise.all([
        this.sendEmail(),
        this.sendSMS('send-sms'),
        this.sendWhatsApp('send-whatsapp')
      ])
      this.errorMsg = ""
      this.successMsg = "All Messages Sent Successfully"
    }
    catch (err: any){
      this.successMsg = "";
      this.errorMsg = err.message
    }
    finally {
      this.loadingAll = false
    }
  }
}
