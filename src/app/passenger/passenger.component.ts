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
  @Input() busColor !: string;
  isActive: boolean = false;
  @Output() updatePassengerExclusionList = new EventEmitter<Passenger>()

  constructor(private tourOrganizer: TourOrganizerService) {
  }

  toggleButton() {
    this.isActive = !this.isActive;
    console.log(this.isActive)
  }

  removePassenger() {
    this.updatePassengerExclusionList.emit(this.passengerInfo);
  }

  getButtonStyles() {
    return {
      "border": "1px solid " + this.busColor,
      "color": this.busColor
    }
  }
  getStyles() {
    return {
      'border-left': "10px solid " + this.busColor
    }
  }
}
