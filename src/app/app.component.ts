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
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {Bus} from "./services/bus"; // Import CommonModule
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {BusSelectionButtonsComponent} from "./bus-selection-buttons/bus-selection-buttons.component";
import {PassengersService} from "./services/passengers.service";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PassengerComponent, CommonModule, BusSelectionButtonsComponent, NgOptimizedImage, FormsModule, ReactiveFormsModule],
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
  successMap: Map<string, [boolean, boolean]> = new Map<string, [boolean, boolean]>();
  excludedPassengersMap: Map<string, Passenger[]> = new Map<string, Passenger[]>();
  assignedPassengersMap: Map<string, Passenger[]> = new Map<string, Passenger[]>();
  excludedPassengers: Passenger[] = [];
  loadContent: boolean = false;
  isAuthorized: boolean = localStorage.getItem('access') != null && localStorage.getItem('secret') != null;
  errorMsg: string = "";
  loading:boolean = false;
  canEdit: boolean = false;
  allBuses= buses.map(bus => ({...bus}));

  form = new FormGroup({
    accessKey: new FormControl('', Validators.required),
    secretKey: new FormControl('', [Validators.required, Validators.email])
  });


  updateBusSelections(event: [string[], string]) {
    this.busSelections.set(event[1], event[0])
  }

  updateAssignedPassengers(event: [string, Passenger]){
    console.log(event)
    if(this.assignedPassengersMap.has(event[0])){
      const passengers = this.assignedPassengersMap.get(event[0]) as Passenger[]
      passengers.push(event[1])
      this.assignedPassengersMap.set(event[0], passengers)
    }
    else{
      if(buses.some(bus => bus.busId == event[0])){
        this.assignedPassengersMap.set(event[0], [event[1]])
      }
      else{
        for (const [key, passengers] of this.assignedPassengersMap.entries()) {
          const index = passengers.findIndex(passenger => passenger.confirmationCode === event[1].confirmationCode);
          if (index !== -1) {
            passengers.splice(index, 1);
            // If the bus has no more passengers, remove the entry from the map
            if (passengers.length === 0) {
              this.assignedPassengersMap.delete(key);
            } else {
              this.assignedPassengersMap.set(key, passengers); // Update with removed passenger
            }
            break;
          }
        }
      }
    }
    console.log(this.assignedPassengersMap)
  }

  updateUsedBuses(event: [string[], string]) {
    this.usedBuses.set(event[1], event[0]);
    this.excludedPassengersMap.set(event[1], this.excludedPassengers.filter(val => val.startTime == event[1]));
    const filteredPassengers = this.getPassengersByTime(event[1]).filter(val => this.excludedPassengers.filter(passenger => passenger.confirmationCode == val.confirmationCode).length == 0)
    const filteredBuses = this.allBuses.filter(val => event[0].includes(val.busId))
    console.log(filteredBuses, filteredPassengers)
    console.log(this.usedBuses)
    this.organizePassengers(filteredBuses, filteredPassengers)
  }

  constructor(private sanitizer: DomSanitizer, private apiService: ApiService, private tourBusOrganizer: TourOrganizerService, private passengerService: PassengersService) {
    this.fetchOptions = {
      endpoint: '/booking.json/product-booking-search',  // Replace with your actual endpoint
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
    if(this.isAuthorized){
      this.loadPassengers()
      this.form.get('accessKey')?.disable();
      this.form.get('secretKey')?.disable();
    }
    console.log(localStorage.getItem('access'))
    console.log(this.isAuthorized)
  }

  getHTML() {
    this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(this.tourBusOrganizer.printResult());
  }

  onDateChange(event: any){
    this.date = event.target.value;
    this.loadPassengers()
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
    // organizer.loadData(passengers)
    if(this.assignedPassengersMap.size !== 0){
      organizer.assignPassengersToBus(this.assignedPassengersMap)
      organizer.loadData(passengers.filter(passenger => {
        for(const [busId, passengers] of this.assignedPassengersMap.entries()){
          if(passengers.some(OGPassenger => OGPassenger.confirmationCode == passenger.confirmationCode)){
            return false
          }
        }
        return true
      }))
    }
    else{
      organizer.loadData(passengers)
    }
    const isAllocated = organizer.allocatePassengers()
    if(isAllocated[0]){
      console.log(isAllocated)
      organizer.buses.forEach(bus => {
        console.log(bus, bus.getCurrentLoad())
      })
      this.busList = organizer.buses;
      this.tourBusOrganizer.setBuses(passengers[0].startTime, organizer.buses);
      this.successMap.set(passengers[0].startTime, isAllocated)
    }
    else{
      this.successMap.set(passengers[0].startTime, isAllocated)
    }

    this.busList = organizer.buses;
  }

  getNumOfPassengersByTime() {
    const passengers = this.passengers.filter(passenger => this.excludedPassengers.filter(val => passenger.confirmationCode == val.confirmationCode).length == 0)
    const map: Map<string, number> = new Map<string, number>();
    for(const passenger of this.passengers){
      if(map.has(passenger.startTime)){
        let passengers = map.get(passenger.startTime) as number
        passengers += this.excludedPassengers.find(val => val.confirmationCode == passenger.confirmationCode) == undefined ? passenger.numOfPassengers : 0;
        map.set(passenger.startTime, passengers)
      }
      else{
        map.set(passenger.startTime, this.excludedPassengers.find(val => val.confirmationCode == passenger.confirmationCode) == undefined ? passenger.numOfPassengers : 0)
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

  async loadPassengers() {
    try{
      console.log(buses)
      this.errorMsg = "";
      this.loading = true;
      const passengers = await this.apiService.getPassengersFromProductBookings(this.date, this.fetchOptions)
      this.allBuses= buses.map(bus => ({...bus}));
      this.loading = false
      this.loadContent = true;
      this.passengers = passengers
      this.canEdit = false
      this.usedBuses = new Map<string, string[]>();
      this.assignedPassengersMap = new Map<string, Passenger[]>
      this.successMap = new Map<string, [boolean, boolean]>();
      this.resetBusSelection()
      this.tourBusOrganizer.resetBuses();
      this.tourBusOrganizer.setTimeToPassengersMap(this.passengerService.getPassengersByTime(this.passengers))
    }
    catch (e: any){
      this.loading = false
      this.errorMsg = e.message;
      this.loadContent = false
    }

  }

  Authorize() {
    if(!this.isAuthorized){
      this.apiService.setKeys(this.form.value);
      this.form.reset();
      this.form.get('accessKey')?.disable();
      this.form.get('secretKey')?.disable();
      this.loadPassengers()
    }

    else{
      this.apiService.clearKeys();
      this.form.get('accessKey')?.enable();
      this.form.get('secretKey')?.enable();
    }
    this.isAuthorized = !this.isAuthorized;
  }

  getPrevDayPassengers() {
    const [year, month, day] = this.date.split('-').map(Number);

    // Create a new Date object using the provided date
    const date = new Date(year, month - 1, day); // month is zero-indexed

    // Add one day to the date
    date.setDate(date.getDate() - 1);

    // Extract the components of the next day
    const nextYear = date.getFullYear();
    const nextMonth = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const nextDay = String(date.getDate()).padStart(2, '0');

    this.date = `${nextYear}-${nextMonth}-${nextDay}`;
    console.log(this.date)
    this.loadPassengers()
  }

  toggleEditCapacities() {
    this.canEdit = !this.canEdit
  }

  editCapacity(busId: string, event: any) {
    console.log(event)
    this.allBuses.forEach(bus => {
      if(bus.busId === busId){
        bus.capacity = parseInt(event.target.value)
      }
    })
  }
}
