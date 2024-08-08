import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
import {BusSelectionButtonsComponent} from "./bus-selection-buttons/bus-selection-buttons.component";
import {PassengersService} from "./services/passengers.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PassengerComponent, SidePanelComponent, CommonModule, BusSelectionButtonsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  @ViewChild('navbar') navbar!: ElementRef;
  @ViewChild('content') content!: ElementRef;

  ngAfterViewInit() {
    const navbarHeight = this.navbar.nativeElement.offsetHeight;
    this.content.nativeElement.style.marginTop = `${navbarHeight}px`;
  }
  title = 'Bus Allocator';
  fetchOptions: FetchBookingDataOptions;
  passengers: Passenger[] = [];
  today: string = '';
  busList: Bus[] = [];
  htmlContent: SafeHtml = "";
  busSelections: string[][] = [];
  usedBuses: Map<string, string[]> = new Map<string, string[]>;
  successMap: Map<string, boolean> = new Map<string, boolean>();
  excludedPassengers: Passenger[] = [];
  loadContent: boolean = false;
  protected readonly buses = buses;

  updateBusSelections(event: [string[], number]) {
    this.busSelections[event[1]] = event[0]
  }

  updateUsedBuses(event: [string[], string]) {
    this.usedBuses.set(event[1], event[0]);
    const filteredPassengers = this.getPassengersByTime(event[1]).filter(val => this.excludedPassengers.filter(passenger => passenger.confirmationCode == val.confirmationCode).length == 0)
    const filteredBuses = buses.filter(val => event[0].includes(val.busId))
    console.log(filteredBuses, filteredPassengers)
    console.log(this.usedBuses)
    this.organizePassengers(filteredBuses, filteredPassengers)
  }

  constructor(private sanitizer: DomSanitizer, private apiService: ApiService, private tourBusOrganizer: TourOrganizerService, private passengerService: PassengersService) {
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
    this.getTodaysPassengers().then(data => {
      this.resetBusSelection()
      this.tourBusOrganizer.setTimeToPassengersMap(this.passengerService.getPassengersByTime(this.passengers))
      this.loadContent = true
    })
  }

  getHTML() {
    this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(this.tourBusOrganizer.printResult());
  }

  async onDateChange(event: any){
    const passengers = await this.apiService.getPassengers(event.target.value, this.fetchOptions)
    this.passengers = passengers.filter(val => val.pickup != null)
    this.usedBuses = new Map<string, string[]>();
    this.successMap = new Map<string, boolean>();
    this.resetBusSelection()
    this.tourBusOrganizer.resetBuses();
    this.tourBusOrganizer.setTimeToPassengersMap(this.passengerService.getPassengersByTime(this.passengers))
  }

  getBusesByTime(time: string){
    return this.tourBusOrganizer.getBusesByTime(time)
  }

  resetBusesForTime(event: [string, number]){
    this.usedBuses.delete(event[0]);
    this.successMap.delete(event[0]);
    this.busSelections[event[1]] = [];
    this.tourBusOrganizer.resetBusesForTime(event[0]);
  }

  resetBusSelection() {
    this.busSelections = []
    for(let i = 0; i<this.getNumOfPassengersByTime().length; i++){
      this.busSelections.push([])
    }
  }

  organizePassengers(busInfoList: IBus[], passengers: Passenger[]) {
    const organizer = new TourOrganizer(busInfoList)
    organizer.loadData(passengers)
    if(organizer.allocatePassengers()){
      organizer.buses.forEach(bus => {
        console.log(bus, bus.getCurrentLoad())
      })
      this.busList = organizer.buses;
      this.tourBusOrganizer.setBuses(passengers[0].startTime, organizer.buses);
      this.successMap.set(passengers[0].startTime, true)
    }
    else{
      this.successMap.set(passengers[0].startTime, false)
    }

    this.busList = organizer.buses;
    console.log(this.busList)
    console.log(this.successMap)
  }

  getNumOfPassengersByTime() {
    const map: Map<string, number> = new Map<string, number>();
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
    return this.passengers.filter(val => val.startTime == time)
  }

  async getTodaysPassengers() {
    try{
      const passengers = await this.apiService.getPassengers(this.today, this.fetchOptions)
      this.passengers = passengers.filter(val => val.pickup != null)
    }
    catch (e: any){
      console.log(e)
    }

  }

  updatePassengerExclusionList(event: Passenger) {
    if(this.excludedPassengers.filter(val => val.confirmationCode == event.confirmationCode).length != 0){
      const index = this.excludedPassengers.indexOf(event);
      this.excludedPassengers.splice(index, 1)
    }
    else{
      this.excludedPassengers.push(event)
    }
  }
}
