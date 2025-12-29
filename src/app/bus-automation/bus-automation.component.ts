import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { BusSelectionButtonsComponent } from "../bus-selection-buttons/bus-selection-buttons.component";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { NgForOf, NgIf } from "@angular/common";
import { PassengerComponent } from "../passenger/passenger.component";
import { FetchBookingDataOptions } from "../typings/fetch-data-booking-options";
import { Passenger } from "../typings/passenger";
import { Bus } from "../services/bus";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { IBus } from "../typings/BusSelection";
import { ApiService } from "../services/api.service";
import { TourOrganizerService } from "../services/tour-organizer.service";
import { PassengersService } from "../services/passengers.service";
import { TourOrganizer } from "../services/organizer";
import { BusService } from "../services/bus.service";
import { PickupsService } from "../services/pickups.service";
import { lastValueFrom } from "rxjs";
import { IPickup } from "../typings/ipickup";
import { ActivatedRoute, Router } from "@angular/router";
import { DriversService } from "../services/drivers.service";
import { IDriver } from "../typings/IDriver";
import { PublishedAssignmentsService } from "../services/published-assignments.service";
import { IPublishedAssignment, IBusAssignment, IAssignedPassenger } from "../typings/IPublishedAssignment";

@Component({
  selector: 'app-bus-automation',
  standalone: true,
  imports: [
    BusSelectionButtonsComponent,
    FormsModule,
    NgForOf,
    NgIf,
    PassengerComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './bus-automation.component.html',
  styleUrl: './bus-automation.component.css'
})
export class BusAutomationComponent implements OnInit {
  passengers: Passenger[] = [];
  date: string = '';
  busList: Bus[] = [];
  htmlContent: SafeHtml = "";
  busSelections: Map<string, string[]> = new Map<string, string[]>;
  usedBuses: Map<string, string[]> = new Map<string, string[]>;
  successMap: Map<string, [boolean, boolean]> = new Map<string, [boolean, boolean]>();
  excludedPassengersMap: Map<string, Passenger[]> = new Map<string, Passenger[]>();
  excludedPassengers: Passenger[] = [];
  loadContent: boolean = false;
  isAuthorized: boolean = localStorage.getItem('access') != null && localStorage.getItem('secret') != null;
  errorMsg: string = "";
  loading: boolean = false;
  canEdit: boolean = false;
  allBuses !: IBus[];
  passengerToBusMap = new Map<string, string>();
  scheduleMap = new Map<string, Map<string, string>>();
  isPickupToBusOpen = new Map<string, boolean>;
  form = new FormGroup({
    accessKey: new FormControl('', Validators.required),
    secretKey: new FormControl('', [Validators.required, Validators.email])
  });
  pickupAbbrevs !: IPickup[];

  // Driver assignment properties
  drivers: IDriver[] = [];
  busToDriverMap = new Map<string, string>();  // busId -> driverId
  publishMessage: string = '';
  publishError: string = '';
  isPublishing: boolean = false;
  openDropdowns = new Map<string, boolean>(); // Track which dropdowns are open


  trackByConfirmationID(index: number, passenger: Passenger) {
    return passenger.confirmationCode
  }

  updateBusSelections(event: [string[], string]) {
    const prevValue = this.busSelections.get(event[1]) || []

    this.busSelections.set(event[1], event[0])
    for (const key of this.passengerToBusMap.keys()) {
      console.log(event[0], this.passengerToBusMap.get(key))
      if (!event[0].includes(<string>this.passengerToBusMap.get(key)) && this.passengerService.getPassengerByConfirmationID(this.passengers, key)?.startTime === event[1]) {
        this.passengerToBusMap.set(key, "No Bus Selected")
      }
    }
  }

  updateUsedBuses(event: [string[], string]) {
    this.usedBuses.set(event[1], event[0]);
    this.excludedPassengersMap.set(event[1], this.excludedPassengers.filter(val => val.startTime == event[1]));
    const filteredPassengers = this.getPassengersByTime(event[1]).filter(val => this.excludedPassengers.filter(passenger => passenger.confirmationCode == val.confirmationCode).length == 0)
    const filteredBuses = this.allBuses.filter(val => event[0].includes(val.busId))
    console.log(filteredBuses, filteredPassengers)
    console.log(this.usedBuses)
    this.organizePassengers(filteredBuses, filteredPassengers, Array.from(this.scheduleMap.get(event[1]) || new Map()))
  }

  constructor(private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private apiService: ApiService,
    private tourBusOrganizer: TourOrganizerService,
    private passengerService: PassengersService,
    private busService: BusService,
    private pickupsService: PickupsService,
    private driversService: DriversService,
    private publishedAssignmentsService: PublishedAssignmentsService,
    private eRef: ElementRef
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const storedDate = params['date'];
      if (storedDate) {
        this.date = storedDate;
      } else {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
        const day = String(today.getDate()).padStart(2, '0');
        this.date = `${year}-${month}-${day}`;
      }
      if (this.isAuthorized) {
        this.loadPassengers()
        this.form.get('accessKey')?.disable();
        this.form.get('secretKey')?.disable();
      }
      console.log(localStorage.getItem('access'))
      console.log(this.isAuthorized)
    })
  }

  async getHTML() {
    const printedResult = await this.tourBusOrganizer.printResult()
    this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(printedResult);
  }

  onDateChange(event: any) {
    this.date = event.target.value;
    this.router.navigate([], { queryParams: { date: this.date } });
  }

  getBusesByTime(time: string) {
    return this.tourBusOrganizer.getBusesByTime(time)
  }

  resetBusesForTime(event: [string, number]) {
    this.usedBuses.delete(event[0]);
    this.successMap.delete(event[0]);
    this.busSelections.delete(event[0]);
    for (const key of this.passengerToBusMap.keys()) {
      if (this.passengerService.getPassengerByConfirmationID(this.passengers, key)?.startTime === event[0]) {
        this.passengerToBusMap.delete(key)
      }
    }
    console.log(this.passengerToBusMap)
    this.tourBusOrganizer.resetBusesForTime(event[0]);
  }

  resetBusSelection() {
    this.excludedPassengers = []
    this.busSelections = new Map<string, string[]>()
    this.passengerToBusMap = new Map<string, string>()
  }

  organizePassengers(busInfoList: IBus[], passengers: Passenger[], pickupToBusMap: [string, string][]) {
    console.log(this.passengerToBusMap);
    const passengerToBusList = Array.from(this.passengerToBusMap).filter(item => busInfoList.map(bus => bus.busId).includes(item[1]))
    console.log(passengerToBusList)
    const organizer = new TourOrganizer(busInfoList)
    organizer.loadData(passengers)
    const isAllocated = organizer.allocatePassengers(passengerToBusList, pickupToBusMap)
    if (isAllocated[0]) {
      console.log(isAllocated)
      organizer.buses.forEach(bus => {
        console.log(bus, bus.getCurrentLoad())
      })
      this.busList = organizer.buses;
      this.tourBusOrganizer.setBuses(passengers[0].startTime, organizer.buses);
      this.successMap.set(passengers[0].startTime, isAllocated)
    }
    else {
      this.successMap.set(passengers[0].startTime, isAllocated)
    }

    this.busList = organizer.buses;
  }

  getNumOfPassengersByTime() {
    const passengers = this.passengers.filter(passenger => this.excludedPassengers.filter(val => passenger.confirmationCode == val.confirmationCode).length == 0)
    const map: Map<string, number> = new Map<string, number>();
    for (const passenger of this.passengers) {
      if (map.has(passenger.startTime)) {
        let passengers = map.get(passenger.startTime) as number
        passengers += this.excludedPassengers.find(val => val.confirmationCode == passenger.confirmationCode) == undefined ? passenger.numOfPassengers : 0;
        map.set(passenger.startTime, passengers)
      }
      else {
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
    if (this.excludedPassengers.filter(val => val.confirmationCode == event.confirmationCode).length != 0) {
      const index = this.excludedPassengers.findIndex(val => val.confirmationCode == event.confirmationCode);
      this.excludedPassengers.splice(index, 1)
    }
    else {
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
    this.router.navigate([], { queryParams: { date: this.date } });
    console.log(this.date)
  }

  async loadPassengers() {
    try {
      this.errorMsg = "";
      this.loading = true;
      const passengers = await this.apiService.getPassengersFromProductBookings(this.date, this.apiService.fetchOptions)
      const result = await lastValueFrom(this.pickupsService.getPickupLocations())
      const busesResult = await lastValueFrom(this.busService.getBuses())

      // Load drivers
      const driversResult = await lastValueFrom(this.driversService.getDrivers())
      this.drivers = driversResult.data || [];

      this.allBuses = busesResult.data.sort((a: any, b: any) => {
        return a.sortOrder - b.sortOrder;
      });
      this.pickupAbbrevs = result.data;
      this.loading = false
      this.loadContent = true;
      this.passengers = passengers
      this.canEdit = false
      this.usedBuses = new Map<string, string[]>();
      this.successMap = new Map<string, [boolean, boolean]>();
      this.busToDriverMap = new Map<string, string>();  // Reset driver assignments
      this.publishMessage = '';
      this.publishError = '';
      this.resetBusSelection()
      this.tourBusOrganizer.resetBuses();
      this.tourBusOrganizer.setTimeToPassengersMap(this.passengerService.getPassengersByTime(this.passengers))
      console.log(this.passengerService.getPickupLocationsFromPassengers(passengers, this.pickupAbbrevs));
    }
    catch (e: any) {
      this.loading = false
      this.errorMsg = e.message;
      this.loadContent = false
    }

  }

  getPickupAbbrevByTime(time: string) {
    return this.passengerService.getPickupLocationsFromPassengers(this.passengers, this.pickupAbbrevs).get(time);
  }

  Authorize() {
    if (!this.isAuthorized) {
      this.apiService.setKeys(this.form.value);
      this.form.reset();
      this.form.get('accessKey')?.disable();
      this.form.get('secretKey')?.disable();
      this.loadPassengers()
    }

    else {
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
    this.router.navigate([], { queryParams: { date: this.date } });
  }

  toggleEditCapacities() {
    this.canEdit = !this.canEdit
  }

  editCapacity(busId: string, event: any) {
    console.log(event)
    this.allBuses.forEach(bus => {
      if (bus.busId === busId) {
        bus.capacity = parseInt(event.target.value)
      }
    })
  }

  updatePassengerBusList(event: [Passenger, IBus]) {
    this.passengerToBusMap.set(event[0].confirmationCode, event[1].busId)
    console.log(this.passengerToBusMap)
  }

  updatePickupBusList(pickup: string, busId: string, time: string) {
    const map = this.scheduleMap.get(time) || new Map<string, string>
    map.set(pickup, busId)
    this.scheduleMap.set(time, map)
    console.log(this.scheduleMap)
  }

  removePickup(pickup: string, time: string) {
    const map = this.scheduleMap.get(time) || new Map<string, string>
    map.delete(pickup)
    console.log(this.scheduleMap)
  }

  updateAllowEditBus(event: Passenger) {
    if (this.passengerToBusMap.has(event.confirmationCode)) {
      this.passengerToBusMap.delete(event.confirmationCode)
    }
    else {
      this.passengerToBusMap.set(event.confirmationCode, "Bus Not Chosen")
    }
    console.log(this.passengerToBusMap)
  }

  copyText() {
    const htmlToCopy = document.getElementById('generated-txt')?.innerHTML || '';

    if (htmlToCopy) {
      const blob = new Blob([htmlToCopy], { type: 'text/html' });
      const clipboardItem = new ClipboardItem({ 'text/html': blob });

      navigator.clipboard.write([clipboardItem])
        .then(() => {
          console.log('HTML copied to clipboard successfully!');
        })
        .catch((err) => {
          console.log('Failed to copy HTML to clipboard', err);
        });
    }
  }
  // Driver assignment methods
  onDriverAssigned(event: { busId: string, driverId: string, time: string }) {
    this.busToDriverMap.set(`${event.busId}-${event.time}`, event.driverId);
    console.log('Driver assigned:', event, this.busToDriverMap);
  }

  getDriverById(driverId: string): IDriver | undefined {
    return this.drivers.find(d => d.docId === driverId);
  }

  getSelectedDriver(busId: string, time: string): string {
    return this.busToDriverMap.get(`${busId}-${time}`) || '';
  }

  isDriverAssignedElsewhere(driverId: string, currentBusId: string, time: string): boolean {
    // Only check for conflicts within the SAME time slot
    const busesInTime = this.usedBuses.get(time) || [];

    for (const busId of busesInTime) {
      if (busId !== currentBusId) {
        const assignedDriver = this.busToDriverMap.get(`${busId}-${time}`);
        if (assignedDriver === driverId) {
          return true;
        }
      }
    }
    return false;
  }

  // Custom dropdown methods
  toggleDropdown(busId: string, time: string) {
    const key = `${busId}-${time}`;
    const isOpen = this.openDropdowns.get(key) || false;
    // Close all other dropdowns
    this.openDropdowns.clear();
    // Toggle this one
    if (!isOpen) {
      this.openDropdowns.set(key, true);
    }
  }

  selectDriver(busId: string, driverId: string, time: string) {
    this.onDriverAssigned({ busId, driverId, time });
    this.openDropdowns.set(`${busId}-${time}`, false);
  }

  getDriverNameById(driverId: string): string {
    const driver = this.drivers.find(d => d.docId === driverId);
    return driver?.name || '-- Select Driver --';
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.openDropdowns.clear();
    } else {
      // If the click is inside the component, we still need to check if it's inside a dropdown
      // This is a simplified check. A more robust one checks if the target is within a .custom-dropdown
      // However, since toggleDropdown stops propagation or handles its own logic, we just need to handle clicks *elsewhere* in the component if needed.
      // Actually, the easiest way for "click outside" specific dropdowns is:
      const isDropdownClick = event.target.closest('.custom-dropdown');
      if (!isDropdownClick) {
        this.openDropdowns.clear();
      }
    }
  }

  // Check if all used buses have drivers assigned
  allBusesHaveDrivers(): boolean {
    for (const [time, buses] of this.usedBuses.entries()) {
      for (const busId of buses) {
        if (!this.busToDriverMap.has(`${busId}-${time}`) || !this.busToDriverMap.get(`${busId}-${time}`)) {
          return false;
        }
      }
    }
    return this.usedBuses.size > 0;  // Must have at least some buses
  }

  // Publish assignments to driver portal
  async publishToDriverPortal() {
    this.publishMessage = '';
    this.publishError = '';

    // Validate all buses have drivers
    if (!this.allBusesHaveDrivers()) {
      this.publishError = 'Please assign a driver to each bus before publishing.';
      return;
    }

    this.isPublishing = true;

    try {
      const assignments: IBusAssignment[] = [];

      for (const [time, buses] of this.usedBuses.entries()) {
        for (const busId of buses) {
          const driverId = this.busToDriverMap.get(`${busId}-${time}`) || '';
          const driver = this.getDriverById(driverId);

          // Get passengers for this bus
          const busPassengers = this.tourBusOrganizer.getBusesByTime(time)
            ?.find(b => b.busId === busId)
            ?.getPassengers() || [];

          const assignedPassengers: IAssignedPassenger[] = busPassengers.map((p: Passenger) => ({
            confirmationCode: p.confirmationCode,
            firstName: p.firstName,
            lastName: p.lastName,
            pickup: this.getPickupAbbreviation(p.pickup),  // Use abbreviation
            numOfPassengers: p.numOfPassengers,
            numOfChildren: p.numOfChildren,
            phoneNumber: p.phoneNumber,
            option: p.option,
          }));

          assignments.push({
            busId,
            driverId,
            driverName: driver?.name || 'Unknown',
            time,
            passengers: assignedPassengers,
          });
        }
      }

      const publishedAssignment: IPublishedAssignment = {
        date: this.date,
        publishedAt: new Date().toISOString(),
        assignments,
      };

      // Call the backend API
      await lastValueFrom(this.publishedAssignmentsService.publishAssignment(publishedAssignment));

      console.log('✅ Successfully published to backend!', publishedAssignment);
      this.publishMessage = 'Successfully published to Driver Portal!';
      this.isPublishing = false;
    } catch (e: any) {
      console.error('❌ Publish failed:', e);
      this.publishError = `Failed to publish: ${e.message || 'Unknown error'}`;
      this.isPublishing = false;
    }
  }

  // Helper method to get pickup abbreviation
  getPickupAbbreviation(pickupName: string): string {
    const pickup = this.pickupAbbrevs?.find(p => pickupName.includes(p.name));
    return pickup?.abbreviation || pickupName;
  }
}
