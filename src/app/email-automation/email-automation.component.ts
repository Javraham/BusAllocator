import { Component } from '@angular/core';
import {Passenger} from "../typings/passenger";
import {ApiService} from "../services/api.service";
import {PassengersService} from "../services/passengers.service";
import {IPickup, pickups} from "../typings/ipickup";
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ExpandableSectionComponent} from "../expandable-section/expandable-section.component";
import {EmailContainerComponent} from "../email-container/email-container.component";
import {IEmail} from "../typings/IEmail";

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
  date: string = "";
  isAuthorized: boolean = localStorage.getItem('access') != null && localStorage.getItem('secret') != null;
  passengers: Passenger[] = [];
  pickupLocations: Map<string, number> = new Map<string, number>();
  loadContent: boolean = false;
  passengerListByLocation: Passenger[] = [];

  constructor(private apiService: ApiService, private passengerService: PassengersService) {
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
  }

  async loadPassengers() {
    this.loadContent = false
    this.passengers = await this.apiService.getPassengersFromProductBookings(this.date, this.apiService.fetchOptions)
    this.pickupLocations = this.passengerService.getTotalPassengersByPickupLocations(this.passengers)
    this.loadContent = true
  }

  getPickupLocations(): IPickup[]{
    return Array.from(this.pickupLocations).map(val => {
      return {name: val[0], abbreviation: pickups.find(pickup => val[0].includes(pickup.name))?.abbreviation || val[0]}
    })
  }

  getPassengersByLocation(location: string){
    return this.passengerService.getPassengersByPickupLocation(location, this.passengers)
  }

  getEmailObject(location: string, abbrev: string): IEmail {
    const passengers = this.getPassengersByLocation(location)
    const subject = "Reminder: Tour is set for " + this.date.toString() + " for " + abbrev
    const body = "Type your email here!"
    return {
      passengers,
      subject,
      body
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
}
