import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
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
export class EmailContainerComponent implements OnInit, OnChanges{
  @Input() emailInfo !: IEmail;
  @Input() pickupPlace !: string;
  @Input() pickupAbbrev !: string;
  @Input() tourTime !: string;
  @Input() EmailSentLocations !: any;
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
    this.setupEmailForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['emailInfo'] && changes['emailInfo'].currentValue) {
      console.log(changes)
      this.form.patchValue({body: this.emailInfo.body, subject: this.emailInfo.subject})
    }
  }

  setupEmailForm() {
    let currentBody = this.emailInfo.body;
    const mapLinkIndex = currentBody.indexOf("Map link:");

    if (mapLinkIndex !== -1) {
      currentBody = currentBody.slice(0, mapLinkIndex) + "Tour Date: " + this.emailInfo.formattedDate + '\n\n' + "Location: " + this.pickupPlace + '\n\n' + currentBody.slice(mapLinkIndex);
    }

    this.form = new FormGroup({
      subject: new FormControl(this.emailInfo.subject, [Validators.required]),
      body: new FormControl(currentBody, [Validators.required]),
    });

    this.passengers = this.getPassengersWithUnsentEmails(this.emailInfo.passengers);
  }


  checkDate() {
    const now = new Date(); // Get the current date
    const twoDaysAgo = new Date(now);
    const threeDaysFromNow = new Date(now);

    twoDaysAgo.setDate(now.getDate() - 2);
    threeDaysFromNow.setDate(now.getDate() + 3);

    const target = new Date(this.emailInfo.date);

    return (target < twoDaysAgo || target > threeDaysFromNow);
  }

  // sendSMS(endpoint: string, event?: any): Promise<any> {
  //   if(event) event.preventDefault(); // Prevent form submission
  //
  //   const message = this.form.value.body + '\n\n **NO REPLY** \n' +
  //     'We can be contacted at book@tourstoniagarafalls.com or +1 416-792-7968'
  //
  //   return new Promise((resolve, reject) => {
  //     if (this.form.invalid || this.passengers.length === 0) {
  //       this.form.markAllAsTouched();
  //       reject(undefined)
  //       return;
  //     }
  //     this.loadingSentSMS = true;
  //     this.emailService.sendSMS({
  //       passengers: this.passengers,
  //       message,
  //       date: this.emailInfo.date,
  //       location: this.emailInfo.location,
  //       tourTime: this.tourTime
  //     },endpoint).subscribe({
  //       next: (response) => {
  //         this.errorMsg = ""
  //         this.successMsg = response.message
  //         this.loadingSentSMS = false;
  //         console.log(response.data)
  //         this.updateSentMessages.emit([response.data, "sms", this.pickupPlace])
  //         resolve(undefined)
  //       },
  //       error: (error) => {
  //         console.error(error)
  //         this.successMsg = ""
  //         console.log(error)
  //         this.errorMsg = error.message == undefined ? "Failed to connect to server." : error.message;
  //         this.loadingSentSMS = false;
  //         reject(undefined)
  //       },
  //     })
  //   })
  // }

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
        location: this.emailInfo.location,
        tourTime: this.tourTime
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

  getPassengersWithUnsentEmails(passengers: Passenger[]): Passenger[]{
    const emails = this.EmailSentLocations.map((location: any) => location.sentTo).flat()
    return passengers.filter(passenger => {
      return !emails?.includes(passenger.email)
    })
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
        location: this.emailInfo.location,
        tourTime: this.tourTime
      }).subscribe({
        next: (response) => {
          this.errorMsg = ""
          this.successMsg = response.message
          this.loadingSentEmail = false
          console.log(response)
          this.updateSentMessages.emit([response.data, "email", this.pickupPlace])
          this.passengers = this.getPassengersWithUnsentEmails(this.emailInfo.passengers)
          resolve(undefined)
        },
        error: (error) => {
          this.successMsg = ""
          this.errorMsg = error.message == undefined ? "Failed to connect to server." : error.message;
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
        // this.sendSMS('send-sms'),
        this.sendWhatsApp('send-whatsapp'),
        this.sendEmail()
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
