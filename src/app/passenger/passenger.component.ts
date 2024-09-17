import {Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {TourOrganizerService} from "../services/tour-organizer.service";
import {TourOrganizer} from "../services/organizer";
import {Passenger} from "../typings/passenger";
import {Input} from "@angular/core";
import {NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {PickupsService} from "../services/pickups.service";
import {lastValueFrom} from "rxjs";
import {IPickup} from "../typings/ipickup";
import {FormsModule} from "@angular/forms";
import {IBus} from "../typings/BusSelection";


@Component({
  selector: 'app-passenger',
  standalone: true,
  imports: [
    NgIf,
    NgStyle,
    NgClass,
    FormsModule,
    NgForOf
  ],
  templateUrl: './passenger.component.html',
  styleUrl: './passenger.component.css'
})
export class PassengerComponent {
  @Input() passengerInfo !: Passenger;
  @Input() excludedPassengers !: Passenger[];
  @Input() busColor !: string;
  @Input() pickupAbbrevs !: IPickup[]
  @Input() selectedBuses !: Map<string, string[]>;
  @Input() buses !: IBus[];
  isActive: boolean = false;
  @Output() updatePassengerExclusionList = new EventEmitter<Passenger>();
  @Output() updatePassengerBusList = new EventEmitter<[Passenger, IBus]>();
  @Output() updateAllowEditBus = new EventEmitter<Passenger>();
  @Input() selectedPassengerBus !: Map<string, string>;

  trackByBusId(index: number, bus: IBus){
    return bus.busId
  }

  constructor() {
    console.log("hello")
  }

  toggleButton() {
    this.updatePassengerExclusionList.emit(this.passengerInfo)
    console.log(this.passengerInfo)
    console.log(this.excludedPassengers)
  }

  getSelectedBuses(){
    return this.buses.filter(bus => this.selectedBuses.get(this.passengerInfo.startTime)?.includes(bus.busId))
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
      // 'border-right': "1px solid " + this.busColor,
      // 'border-top': "1px solid " + this.busColor,
      // 'border-bottom': "1px solid " + this.busColor
    }
  }

  getPickupAbbrev(passenger: Passenger) {
    const pickupAbbrev = this.pickupAbbrevs.find((pickup: IPickup) => passenger.pickup?.includes(pickup.name))?.abbreviation;
    return pickupAbbrev ? ` (${pickupAbbrev}) ` : 'No Location';
  }

  onBusChange(bus: IBus) {
    this.updatePassengerBusList.emit([this.passengerInfo, bus])
  }

  isChecked(busId: string) {
    console.log(busId === this.selectedPassengerBus.get(this.passengerInfo.confirmationCode))
    return busId === this.selectedPassengerBus.get(this.passengerInfo.confirmationCode)
  }

  toggleEditBus() {
    this.updateAllowEditBus.emit(this.passengerInfo)
  }
}
