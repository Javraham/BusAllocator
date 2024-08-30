import {Component, QueryList, ViewChildren} from '@angular/core';
import {Passenger} from "../typings/passenger";
import {ApiService} from "../services/api.service";
import {PassengersService} from "../services/passengers.service";
import {IPickup, pickups} from "../typings/ipickup";
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ExpandableSectionComponent} from "../expandable-section/expandable-section.component";
import {EmailContainerComponent} from "../email-container/email-container.component";
import {IEmail} from "../typings/IEmail";
import {MessageService} from "../services/message.service";

@Component({
  selector: 'app-email-automation',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    NgIf,
    ExpandableSectionComponent,
    EmailContainerComponent
  ],
  templateUrl: './email-automation.component.html',
  styleUrl: './email-automation.component.css'
})
export class EmailAutomationComponent {
  @ViewChildren(EmailContainerComponent) emailContainers!: QueryList<EmailContainerComponent>;
  date: string = "";
  isAuthorized: boolean = localStorage.getItem('access') != null && localStorage.getItem('secret') != null;
  passengers: Passenger[] = [];
  pickupLocations: Map<string, number> = new Map<string, number>();
  loadContent: boolean = false;
  passengerListByLocation: Passenger[] = [];
  loadingSentMails: boolean = false;
  sentMessageLocations: any;
  loadingSentSMS: boolean = false;
  loadingSentWhatsApp: boolean = false;

  constructor(private apiService: ApiService, private passengerService: PassengersService, private emailService: MessageService) {

  }

  EmailSentLocation(pickup: string): any[]{
    return this.sentMessageLocations?.location.find((location: any) => location.PickupName === pickup)?.emails || []
  }

  SMSSentLocation(pickup: string): any[]{
    return this.sentMessageLocations?.location.find((location: any) => location.PickupName === pickup)?.sms || []
  }

  WhatsAppSentLocation(pickup: string): any[]{
    return this.sentMessageLocations?.location.find((location: any) => location.PickupName === pickup)?.whatsapp || []
  }

  trackByPickup(index: number, pickup: IPickup): string {
    return pickup.name; // or return a unique identifier for the pickup
  }

  ngOnInit() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
    const day = String(today.getDate()).padStart(2, '0');
    this.date = `${year}-${month}-${day}`;
    if(this.isAuthorized){
      this.loadPassengers()
    }
    this.getSentMessages()
  }

  updateSentMessageLocations(event: any) {
    this.sentMessageLocations = event
  }

  getSentMessages(){
    this.emailService.getSentMessages(this.date).subscribe({
      next: response => {
        console.log(response)
        this.sentMessageLocations = response;
        this.sentMessageLocations?.location.forEach((location: any) => console.log(location.PickupName))
      },
      error: err => console.log(err)
    })
  }

  async loadPassengers() {
    this.getSentMessages()
    this.loadContent = false
    this.passengers = await this.apiService.getPassengersFromProductBookings(this.date, this.apiService.fetchOptions)
    this.pickupLocations = this.passengerService.getTotalPassengersByPickupLocations(this.passengers)
    this.loadContent = true
  }

  getPickupLocations(): IPickup[] {
    return Array.from(this.pickupLocations).map(val => {
      return {
        name: val[0],
        abbreviation: pickups.find(pickup => val[0].includes(pickup.name))?.abbreviation || val[0],
        emailTemplate: {
          subject: pickups.find(pickup => val[0].includes(pickup.name))?.emailTemplate.subject || "Niagara Tour Confirmation for",
          body: pickups.find(pickup => val[0].includes(pickup.name))?.emailTemplate.body || "Write Email Here."
        }
      }
    })
  }

  getPassengersByLocation(location: string){
    return this.passengerService.getPassengersByPickupLocation(location, this.passengers)
  }

  getEmailObject(location: IPickup): IEmail {
    const dateObject = new Date(this.date)
    const day = dateObject.getDate();
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const dayOfWeekNames = [
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];

    const formattedDate = `${dayOfWeekNames[dateObject.getDay()]}, ${monthNames[dateObject.getMonth()]} ${day}`;
    const passengers = this.getPassengersByLocation(location.name)
    const subject = location.emailTemplate.subject + ' ' + formattedDate
    const body = location.emailTemplate.body
    return {
      passengers,
      subject,
      body,
      date: this.date,
      location: location.abbreviation
    }
  }

  getPrevDayPassengers() {
    const [year, month, day] = this.date.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is zero-indexed

    date.setDate(date.getDate() - 1);

    const nextYear = date.getFullYear();
    const nextMonth = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const nextDay = String(date.getDate()).padStart(2, '0');

    this.date = `${nextYear}-${nextMonth}-${nextDay}`;
    console.log(this.date)
    this.loadPassengers()
  }

  getNextDayPassengers() {
    const [year, month, day] = this.date.split('-').map(Number);

    // Create a new Date object using the provided date
    const date = new Date(year, month - 1, day); // month is zero-indexed

    // Add one day to the date
    date.setDate(date.getDate() + 1);

    // Extract the components of the next day
    const nextYear = date.getFullYear();
    const nextMonth = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const nextDay = String(date.getDate()).padStart(2, '0');

    this.date = `${nextYear}-${nextMonth}-${nextDay}`;
    console.log(this.date)
    this.loadPassengers()
  }

  onDateChange(event: any){
    this.date = event.target.value;
    this.loadPassengers()
  }

  sendAll(){
    const emailBody: IEmail[] = this.emailContainers.map(child => child.getEmailBodyFromChild())
    this.emailService.sendAllEmails(emailBody).subscribe({
      next: response => console.log(response),
      error: err => console.log(err)
    })
  }

  async sendSMSToAll(){
    this.loadingSentSMS = true;

    for (const child of this.emailContainers.toArray()) {
      try {
        await child.sendSMS('send-sms');  // Wait for each SMS to complete
      } catch (error) {
        console.error('Error sending SMS:', error);  // Handle the error and continue
      }
    }

    this.loadingSentSMS = false;
  }

  async sendWhatsAppToAll(){
    this.loadingSentWhatsApp = true;

    for (const child of this.emailContainers.toArray()) {
      try {
        await child.sendSMS('send-whatsapp');  // Wait for each SMS to complete
      } catch (error) {
        console.error('Error sending SMS:', error);  // Handle the error and continue
      }
    }

    this.loadingSentWhatsApp = false;
  }

  async sendEmailToAll() {
    this.loadingSentMails = true;

    for (const child of this.emailContainers.toArray()) {
      try {
        await child.sendEmail();  // Wait for each SMS to complete
      } catch (error) {
        console.error('Error sending Email:', error);  // Handle the error and continue
      }
    }

    this.loadingSentMails = false;
  }
}
