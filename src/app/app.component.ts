import {Component, ElementRef, model, OnInit, ViewChild} from '@angular/core';
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
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {Bus} from "./services/bus"; // Import CommonModule
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {BusSelectionButtonsComponent} from "./bus-selection-buttons/bus-selection-buttons.component";
import {PassengersService} from "./services/passengers.service";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PassengerComponent, SidePanelComponent, CommonModule, BusSelectionButtonsComponent, NgOptimizedImage, FormsModule, ReactiveFormsModule],
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
  date: string = '';
  busList: Bus[] = [];
  htmlContent: SafeHtml = "";
  busSelections: Map<string, string[]> = new Map<string, string[]>;
  usedBuses: Map<string, string[]> = new Map<string, string[]>;
  successMap: Map<string, boolean> = new Map<string, boolean>();
  excludedPassengersMap: Map<string, Passenger[]> = new Map<string, Passenger[]>();
  excludedPassengers: Passenger[] = [];
  loadContent: boolean = false;
  isAuthorized: boolean = localStorage.length > 0;

  form = new FormGroup({
    accessKey: new FormControl('', Validators.required),
    secretKey: new FormControl('', [Validators.required, Validators.email])
  });
  protected readonly buses = buses;

  updateBusSelections(event: [string[], string]) {
    this.busSelections.set(event[1], event[0])
    console.log("app", this.busSelections)
  }

  updateUsedBuses(event: [string[], string]) {
    this.usedBuses.set(event[1], event[0]);
    this.excludedPassengersMap.set(event[1], this.excludedPassengers.filter(val => val.startTime == event[1]));
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
    this.date = `${year}-${month}-${day}`;
  }

  getHTML() {
    this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(this.tourBusOrganizer.printResult());
  }

  onDateChange(event: any){
    this.date = event.target.value;
  }

  getBusesByTime(time: string){
    return this.tourBusOrganizer.getBusesByTime(time)
  }

  resetBusesForTime(event: [string, number]){
    this.usedBuses.delete(event[0]);
    this.successMap.delete(event[0]);
    this.busSelections.delete(event[0]);
    this.tourBusOrganizer.resetBusesForTime(event[0]);
  }

  resetBusSelection() {
    this.excludedPassengers = []
    this.busSelections = new Map<string, string[]>()
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
  }

  getNumOfPassengersByTime() {
    const passengers = this.passengers.filter(passenger => this.excludedPassengers.filter(val => passenger.confirmationCode == val.confirmationCode).length == 0)
    const map: Map<string, number> = new Map<string, number>();
    for(const passenger of passengers){
      if(map.has(passenger.startTime)){
        let passengers = map.get(passenger.startTime) as number
        passengers += passenger.numOfPassengers;
        map.set(passenger.startTime, passengers)
      }
      else{
        map.set(passenger.startTime, passenger.numOfPassengers)
      }
    }

    return Array.from(map.entries()).sort((a, b) => {
      const timeA = a[0];
      const timeB = b[0];
      return timeA.localeCompare(timeB);
    });
  }

  getPassengersByTime(time: string) {
    return this.passengers.filter(val => val.startTime == time)
  }

  updatePassengerExclusionList(event: Passenger) {
    if(this.excludedPassengers.filter(val => val.confirmationCode == event.confirmationCode).length != 0){
      const index = this.excludedPassengers.findIndex(val => val.confirmationCode == event.confirmationCode);
      this.excludedPassengers.splice(index, 1)
    }
    else{
      this.excludedPassengers.push(event)
    }
    console.log(this.excludedPassengersMap)
  }

  async loadPassengers() {
    const passengers = await this.apiService.getPassengers(this.date, this.fetchOptions)
    this.loadContent = true;
    this.passengers = passengers.filter(val => val.pickup != null)
    this.usedBuses = new Map<string, string[]>();
    this.successMap = new Map<string, boolean>();
    this.resetBusSelection()
    this.tourBusOrganizer.resetBuses();
    this.tourBusOrganizer.setTimeToPassengersMap(this.passengerService.getPassengersByTime(this.passengers))
  }

  Authorize(form: any) {
    this.isAuthorized = !this.isAuthorized;
    if(this.isAuthorized){
      this.apiService.clearKeys()
      this.form.reset()
    }
    console.log(this.form.value.accessKey)
    this.apiService.setKeys(this.form.value)
  }

}
