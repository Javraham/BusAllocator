import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ApiService} from "./services/api.service";
import {FetchBookingDataOptions} from "./typings/fetch-data-booking-options";
import {Passenger} from "./typings/passenger";
import {TourOrganizerService} from "./services/tour-organizer.service";
import {buses, IBus} from "./typings/BusSelection";
import {BusService} from "./services/bus.service";
import {TourOrganizer} from "./services/organizer";
import {PassengerComponent} from "./passenger/passenger.component";
import {SidePanelComponent} from "./side-panel/side-panel.component";
import { CommonModule } from '@angular/common';
import {Bus} from "./services/bus"; // Import CommonModule
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {DropdownComponent} from "./dropdown/dropdown.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PassengerComponent, SidePanelComponent, CommonModule, DropdownComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Bus Allocator';
  fetchOptions: FetchBookingDataOptions;
  passengers: Passenger[] = [];
  today: string = '';
  busList: Bus[] = [];
  htmlContent: SafeHtml = "";

  constructor(private sanitizer: DomSanitizer, private apiService: ApiService, private tourBusOrganizer: TourOrganizerService, private busService: BusService) {
    this.fetchOptions = {
      endpoint: '/booking.json/booking-search',  // Replace with your actual endpoint
      accessKey: 'bbcf21ba55a94a11b99c10c65406f4f6',
      secretKey: '765b889ad3344f5886a717cd8b490152',
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      httpMethod: "POST",
    };
  }

  ngOnInit() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
    const day = String(today.getDate()).padStart(2, '0');
    this.today = `${year}-${month}-${day}`;
    this.getTodaysPassengers()
  }

  getHTML() {
    this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(this.tourBusOrganizer.printResult());

  }

  async onDateChange(event: any){
    this.passengers = await this.apiService.getPassengers(event.target.value, this.fetchOptions)
    this.organizePassengers()
  }

  organizePassengers() {
    const organizer = new TourOrganizer(buses)
    organizer.loadData(this.passengers)
    organizer.allocatePassengers()
    organizer.buses.forEach(bus => {
      console.log(bus, bus.getCurrentLoad())
    })

    this.busList = organizer.buses;
    console.log(this.busList)
    this.tourBusOrganizer.setBuses(organizer.buses);
  }

  getNumOfPassengersByTime() {
    const map: Map<string, number> = new Map<string, number>
    for(const passenger of this.passengers){
      if(map.has(passenger.startTime)){
        let passengers = map.get(passenger.startTime) as number
        passengers += passenger.numOfPassengers;
        map.set(passenger.startTime, passengers)
      }
      else{
        map.set(passenger.startTime, passenger.numOfPassengers)
      }
    }
    return Array.from(map.entries())
  }

  getPassengersByTime(time: string) {
    const newPassengers = this.passengers.filter(val => val.startTime == time)
    return newPassengers
  }

  async getTodaysPassengers() {
    this.passengers = await this.apiService.getPassengers(this.today, this.fetchOptions)
    this.organizePassengers()
  }

  async getTomorrowsPassengers() {
    const today = new Date();
    const tomorrow = new Date(today);

    tomorrow.setDate(today.getDate() + 1);

    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
    const day = String(tomorrow.getDate()).padStart(2, '0');

    this.passengers = await this.apiService.getPassengers(`${year}-${month}-${day}`, this.fetchOptions)
    console.log(this.passengers)
  }

  protected readonly buses = buses;
}
