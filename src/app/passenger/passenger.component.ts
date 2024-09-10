import {Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {TourOrganizerService} from "../services/tour-organizer.service";
import {TourOrganizer} from "../services/organizer";
import {Passenger} from "../typings/passenger";
import {Input} from "@angular/core";
import {NgClass, NgIf, NgStyle} from "@angular/common";
import {PickupsService} from "../services/pickups.service";
import {lastValueFrom} from "rxjs";
import {IPickup} from "../typings/ipickup";


@Component({
  selector: 'app-passenger',
  standalone: true,
  imports: [
    NgIf,
    NgStyle,
    NgClass
  ],
  templateUrl: './passenger.component.html',
  styleUrl: './passenger.component.css'
})
export class PassengerComponent {
  @Input() passengerInfo !: Passenger;
  @Input() excludedPassengers !: Passenger[];
  @Input() busColor !: string;
  @Input() pickupAbbrevs !: IPickup[]
  isActive: boolean = false;
  @Output() updatePassengerExclusionList = new EventEmitter<Passenger>();

  constructor(private pickupService: PickupsService) {
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
      // 'border-right': "1px solid " + this.busColor,
      // 'border-top': "1px solid " + this.busColor,
      // 'border-bottom': "1px solid " + this.busColor
    }
  }

  getPickupAbbrev(passenger: Passenger) {
    const pickupAbbrev = this.pickupAbbrevs.find((pickup: IPickup) => passenger.pickup?.includes(pickup.name))?.abbreviation;
    return pickupAbbrev ? ` (${pickupAbbrev}) ` : 'No Location';
  }
}
