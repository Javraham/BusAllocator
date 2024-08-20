import {Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {TourOrganizerService} from "../services/tour-organizer.service";
import {TourOrganizer} from "../services/organizer";
import {Passenger} from "../typings/passenger";
import {Input} from "@angular/core";
import {NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {pickups} from "../typings/ipickup";
import {buses} from "../typings/BusSelection";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";


@Component({
  selector: 'app-passenger',
  standalone: true,
  imports: [
    NgIf,
    NgStyle,
    NgClass,
    NgForOf,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './passenger.component.html',
  styleUrl: './passenger.component.css'
})
export class PassengerComponent {
  @Input() passengerInfo !: Passenger;
  @Input() excludedPassengers !: Passenger[];
  @Input() assignedPassengersMap !: Map<string, Passenger[]>;
  @Input() busColor !: string;
  isActive: boolean = false;
  @Output() updatePassengerExclusionList = new EventEmitter<Passenger>()
  @Output() updateAssignedPassengersMap = new EventEmitter<[string, Passenger]>()
  selected: string = "N1"
  form: any = new FormGroup({
    selectControl: new FormControl("")
  });

  constructor(private tourOrganizer: TourOrganizerService) {
  }

  ngOnInit(){
    this.form.get('selectControl').setValue(this.getAssignedBus());
  }

  toggleButton() {
    this.updatePassengerExclusionList.emit(this.passengerInfo)
    console.log(this.passengerInfo)
    console.log(this.excludedPassengers)
  }

  getButtonStyles() {
    return this.excludedPassengers.filter(val => this.passengerInfo.confirmationCode == val.confirmationCode).length == 0 ? {
      "border": "1px solid " + this.busColor,
      "color": this.busColor,
        "background-color": this.busColor + 9,
      "font-weight": "600"
      }
    :
      {
        "border": "1px solid " + this.busColor,
        "color": "white",
        "background-color": this.busColor,
        "font-weight": "600"
      }

  }
  getStyles() {
    return {
      'border-left': "10px solid " + this.busColor,
      'background-color': "white",
    }
  }

  getPickupAbbrev(passenger: Passenger): string {
    const pickupAbbrev = pickups.find(pickup => passenger.pickup?.includes(pickup.name))?.abbreviation;
    return pickupAbbrev ? ` (${pickupAbbrev}) ` : 'No Location';
  }

  protected readonly buses = buses;

  getAssignedBus() {
    if(this.assignedPassengersMap && this.assignedPassengersMap.entries)
      for(const [busId, passengers] of this.assignedPassengersMap.entries()){
        if(passengers.some(passenger => passenger.confirmationCode === this.passengerInfo.confirmationCode)){
          return busId
        }
      }
    return "None"
  }

  setPassengerToBus(event: any) {
    const busId: string = event.target.value
    this.updateAssignedPassengersMap.emit([busId, this.passengerInfo])
  }
}
