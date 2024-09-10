import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {NgIf, NgStyle} from "@angular/common";
import {Passenger} from "../typings/passenger";

@Component({
  selector: 'app-expandable-section',
  standalone: true,
  imports: [
    NgIf,
    NgStyle
  ],
  templateUrl: './expandable-section.component.html',
  styleUrl: './expandable-section.component.css'
})
export class ExpandableSectionComponent{
  @Input() title!: string;
  isExpanded: boolean = false
  @Input() numOfPassengers !: number;
  @Input() EmailSentLocations !: string[]
  @Input() SMSSentLocations !: string[]
  @Input() WhatsAppSentLocations !: string[]
  @Input() passengers!: Passenger[]

  constructor() {
  }

  getUnsentEmailsPassengerNames() {
    const filteredPassengers = this.passengers.filter(passenger => !this.EmailSentLocations.includes(passenger.email))
    return filteredPassengers.map(passenger => passenger.firstName + " " + passenger.lastName)
  }

  getUnsentWhatsAppPassengerNames() {
    const filteredPassengers = this.passengers.filter(passenger => !this.WhatsAppSentLocations.includes(passenger.phoneNumber))
    return filteredPassengers.map(passenger => passenger.firstName + " " + passenger.lastName)
  }

  getUnsentSMSPassengerNames() {
    const filteredPassengers = this.passengers.filter(passenger => !this.SMSSentLocations.includes(passenger.phoneNumber))
    return filteredPassengers.map(passenger => passenger.firstName + " " + passenger.lastName)
  }

  toggle() {
    this.isExpanded = !this.isExpanded
    console.log(this.EmailSentLocations)
  }
}
