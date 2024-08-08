import {Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {TourOrganizerService} from "../services/tour-organizer.service";
import {TourOrganizer} from "../services/organizer";
import {Passenger} from "../typings/passenger";
import {Input} from "@angular/core";
import {NgClass, NgIf, NgStyle} from "@angular/common";


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
  isActive: boolean = false;
  @Output() updatePassengerExclusionList = new EventEmitter<Passenger>()

  constructor(private tourOrganizer: TourOrganizerService) {
  }

  toggleButton() {
    this.updatePassengerExclusionList.emit(this.passengerInfo)
    console.log(this.passengerInfo)
    console.log(this.excludedPassengers)
  }

  getButtonStyles() {
    return this.excludedPassengers.filter(val => this.passengerInfo.confirmationCode == val.confirmationCode).length == 0 ? {
      "border": "1px solid " + this.busColor,
      "color": this.busColor
    }
    :
      {
        "border": "1px solid " + this.busColor,
        "color": "white",
        "background-color": this.busColor
      }

  }
  getStyles() {
    return {
      'border-left': "10px solid " + this.busColor
    }
  }
}
