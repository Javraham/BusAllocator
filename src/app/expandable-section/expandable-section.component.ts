import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {NgClass, NgIf, NgStyle} from "@angular/common";
import {Passenger} from "../typings/passenger";
import {ISentMessageResponse} from "../typings/ISentEmailResonse";

@Component({
  selector: 'app-expandable-section',
  standalone: true,
  imports: [
    NgIf,
    NgStyle,
    NgClass
  ],
  templateUrl: './expandable-section.component.html',
  styleUrl: './expandable-section.component.css'
})
export class ExpandableSectionComponent{
  @Input() title!: string;
  isExpanded: boolean = false
  @Input() numOfPassengers !: number;
  @Input() EmailSentLocations !: ISentMessageResponse | undefined
  @Input() SMSSentLocations !: ISentMessageResponse | undefined
  @Input() WhatsAppSentLocations !: ISentMessageResponse | undefined
  @Input() passengers!: Passenger[]

  constructor() {
  }

  getTimeStamp(obj: ISentMessageResponse | undefined){
    if(!obj?.timestamp) return ""

    const date = new Date(obj.timestamp._seconds * 1000 + obj.timestamp._nanoseconds / 1000000);
    const pad = (num: any) => num.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // Months are 0-based
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    // Return the formatted date as YYYY-MM-DDTHH:MM
    return `${year}-${month}-${day} at ${hours}:${minutes}`;
  }

  getUnsentEmailsPassengerNames() {
    const filteredPassengers = this.passengers.filter(passenger => !this.EmailSentLocations?.sentTo.includes(passenger.email))
    return filteredPassengers.map(passenger => passenger.firstName + " " + passenger.lastName)
  }

  getUnsentWhatsAppPassengerNames() {
    const filteredPassengers = this.passengers.filter(passenger => !this.WhatsAppSentLocations?.sentTo.includes(passenger.phoneNumber ? passenger.phoneNumber.replace(/[a-zA-Z\s]/g, '') : ''))
    return filteredPassengers.map(passenger => passenger.firstName + " " + passenger.lastName)
  }

  getUnsentSMSPassengerNames() {
    const filteredPassengers = this.passengers.filter(passenger => !this.SMSSentLocations?.sentTo.includes( passenger.phoneNumber ? passenger.phoneNumber.replace(/[a-zA-Z\s]/g, '') : ''))
    console.log(this.SMSSentLocations)
    return filteredPassengers.map(passenger => passenger.firstName + " " + passenger.lastName)
  }

  toggle() {
    this.isExpanded = !this.isExpanded
    console.log(this.EmailSentLocations)
  }
}
